#!/bin/bash

echo 'Creating benchmark xml files'

channels_programmes=(
  "0 0"
  "0 1"
  "1 0"
  "1 1"
  "100 100"
  "100 1000"
  "100 10000"
  "100 100000"
  "100 250000"
  "100 500000"
  "100 1000000"
)

quoted_files=""
for i in "${!channels_programmes[@]}"; do
  channels_programmes_arr=(${channels_programmes[$i]})
  channels="${channels_programmes_arr[0]}"
  programmes="${channels_programmes_arr[1]}"
  file="c${channels}-p${programmes}.xml"
  quoted_files+="\"${file}\","

  echo "Writing to ./${file}"
  ./generateXmltvFile.ts -c "${channels}" -p "${programmes}" > "../tests/fixtures/${file}"
done

# Write the quoted file names to ./files.ts
echo "const files = [${quoted_files}]; export { files }" > ../tests/fixtures/files.ts

echo 'Finished creating benchmark xml files'
