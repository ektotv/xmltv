import bench from "nanobench";
import fs from "node:fs";
import { parseXmltv } from "../src/main.js";
import epgParser from "epg-parser";
import { files } from "../tests/fixtures/files.js";
// import xmltv from "xmltv";

// const xmltvParser = new xmltv.Parser() as any;

files.forEach((file) => {
  bench(`@iptv/xmltv parsing: ${file}`, function (b: any) {
    let xmltvString: string | null = fs.readFileSync(
      `./tests/fixtures/${file}`,
      {
        encoding: "utf-8",
      }
    );
    b.start();

    parseXmltv(xmltvString);

    b.end();
    xmltvString = null;
  });

  bench(`epg-parser parsing: ${file}`, function (b: any) {
    let xmltvString: string | null = fs.readFileSync(
      `./tests/fixtures/${file}`,
      {
        encoding: "utf-8",
      }
    );
    b.start();

    epgParser.parse(xmltvString);

    b.end();
    xmltvString = null;
  });

  // bench(`xmltv parsing: ${file}`, function (b: any) {
  //   const readable = fs.createReadStream(
  //     path.resolve(path.resolve(`./tests/fixtures/${file}`))
  //   );

  //   b.start();
  //   console.log("started parsing");
  //   readable.pipe(xmltvParser);

  //   const obj: { programmes: any[] } = {
  //     programmes: [],
  //   };
  //   xmltvParser.on("programme", function (programme: any) {
  //     console.log("programme");
  //     obj.programmes.push(programme);
  //   });

  //   console.log("setting end");
  //   xmltvParser.on("end", () => {
  //     console.log("ended parsing");
  //     b.end();
  //   });
  // });
});
