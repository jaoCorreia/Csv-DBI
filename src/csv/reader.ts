import fs from "fs";
import parser from "csv-parser";

export function readCsv(file: string, options: any) {
  return new Promise<any[]>((resolve, reject) => {
    const rows: any[] = [];

    fs.createReadStream(file)
      .pipe(parser(options))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
}

export function readHeaders(
  file: string,
  separator: string = ";"
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file);
    let headersRead = false;

    stream
      .pipe(parser({ separator }))
      .on("headers", (headers: string[]) => {
        headersRead = true;
        resolve(headers);
        stream.destroy(); // Stop reading after headers
      })
      .on("error", (err) => reject(err))
      .on("end", () => {
        if (!headersRead) resolve([]);
      });
  });
}
