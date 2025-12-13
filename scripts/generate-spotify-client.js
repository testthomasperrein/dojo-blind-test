import { mkdir, writeFile } from "fs/promises";

import openapi from "../openapi.json" assert { type: 'json' };

const targetDirectory = "src/lib/spotify/model";

async function generateSpotifyClient() {
  console.log("\nLaunched generate-spotify-client script");
  console.log('Generating Spotify client from OpenApi spec file...\n')
  await mkdir(targetDirectory, { recursive: true }); // Generate target directory

  const schemas = openapi.components.schemas;
  const typesToGenerate = Object.keys(schemas);

  for (const typeName of typesToGenerate) {
    const typeSchema = schemas[typeName];
    generateType(typeName, typeSchema);
  }
}

function generateType(typeName, typeSchema) {  
  console.log(`Generating type ${typeName}...`);

  const generatedCode = getGeneratedCode(typeName, typeSchema);

  writeFile(`${targetDirectory}/${typeName}.ts`, generatedCode);
}

function getGeneratedCode(typeName, typeSchema) {
  const imports = new Set();
  const generatedType = getGeneratedType(typeSchema, imports);

  // pour éviter les imports circulaires, mais ça n'arrive pas 
  imports.delete(typeName);

  const importLines = [...imports]
    .sort()
    .map((name) => `import { ${name} } from "./${name}";`)
    .join("\n");

  return `${importLines ? importLines + "\n\n" : ""}export type ${typeName} = ${generatedType};\n`;
}

function refToTypeName(ref) {
  const parts = ref.split("/");
  return parts.at(-1) ?? ref;
}

function getGeneratedType(typeSchema, imports) {
  if (!typeSchema) return "unknown";

  if (typeSchema.$ref) {
    const refTypeName = refToTypeName(typeSchema.$ref);
    imports.add(refTypeName);
    return refTypeName;
  }

  if (typeSchema.oneOf) {
    const variants = (typeSchema.oneOf ?? typeSchema.anyOf);

    return variants
      .map((schema) => getGeneratedType(schema, imports))
      .join(" | ");
  }

  if (typeSchema.allOf) {
    return typeSchema.allOf
      .map((schema) => getGeneratedType(schema, imports))
      .join(" & ");
  }

  if (typeSchema.enum) {
    return typeSchema.enum.map((v) => `"${v}"`).join(" | ");
  }

  const schemaType = typeSchema.type;

  switch (schemaType) {
    case "number":
    case "integer":
      return "number";
    case "string":
      return "string";
    case "boolean":
      return "boolean";

    case "array": {
      const itemType = getGeneratedType(typeSchema.items, imports);
      return `${itemType}[]`;
    }

    case "object": {
      const required = new Set(typeSchema.required ?? []);
      const props = typeSchema.properties ?? {};

      const body = Object.entries(props)
        .map(([key, value]) => {
          const optional = required.has(key) ? "" : "?";
          return `${key}${optional}: ${getGeneratedType(value, imports)};`;
        })
        .join("\n");

      return `{\n${body}\n}`;
    }

    default:
      return "unknown"; // le type neutre de typescript
  }
}

generateSpotifyClient();