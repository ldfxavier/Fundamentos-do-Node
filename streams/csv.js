import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./data.csv', import.meta.url);

const stream = fs.createReadStream(csvPath).pipe(parse({
  from_line: 2
}));

const ImportCsv = async () => {
      for await (const line of stream) {
      const [title, description] = line;

      await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        })
      })
    }
}

ImportCsv()