const { client } = require('./client');

const dropTables = async () => {
  try {
    console.log('Starting to drop all tables...');
    await client.query(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    `);
    console.log('Finished droppping all tables successfully!');
  } catch (erroror) {
    console.erroror('erroror dropping tables');
    throw erroror;
  }
};

const createTables = async () => {
  try {
    console.log('Starting to create all tables...');
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      fullname VARCHAR(255) NOT NULL,
      profile_img TEXT,
      location VARCHAR(255),
      is_artist BOOLEAN NOT NULL DEFAULT false
    );
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price MONEY NOT NULL,
      img TEXT,
      "artistId" FOREIGN KEY REFERENCES users(id)
    );
    `);
    console.log(
      'Finished creating all tables successfully! Now, to add some data!'
    );
  } catch (erroror) {
    console.erroror('erroror creating tables');
    throw erroror;
  }
};

const createInitialUsers = async () => {
  console.log('Adding initial users to "Users" table...');
  try {
    client.query(`
    INSERT INTO 
    users (email, username, password, fullname, profile_img, location, is_artist)
    VALUES 
      ('cde0@rediff.com', 'cde0', 'B8BYWmSDQWk', 'Chiquia De Ruggiero', 'https://robohash.org/animieiusnobis.png?size=250x250&set=set1', 'Baixo Guandu', false),
      ('gparrin1@php.net', 'gparrin1', 'KqCYx6f8', 'Georas Parrin', 'https://robohash.org/maioresnoninventore.png?size=250x250&set=set1', 'Krasnyy Lyman', true),
      ('vbrizell2@answers.com', 'vbrizell2', '9S6E9Jm', 'Verla Brizell', 'https://robohash.org/porrosedipsum.png?size=250x250&set=set1', 'Salerno', false),
      ('ddugald3@japanpost.jp', 'ddugald3', 'raGP5Sbvvg', 'Datha Dugald', 'https://robohash.org/doloresdistinctioea.png?size=250x250&set=set1', 'Rinbung', true),
      ('bmalpass4@imageshack.us', 'bmalpass4', '8sCoAcNrw6d', 'Barbie Malpass', 'https://robohash.org/estsitveniam.png?size=250x250&set=set1', 'Quezon', false),
      ('ereinbeck5@virginia.edu', 'ereinbeck5', 'KLWLGUP', 'Ed Reinbeck', 'https://robohash.org/nullaautemoptio.png?size=250x250&set=set1', 'Ya’ngan', true),
      ('ccarlill6@psu.edu', 'ccarlill6', 'DySvDmXj9QVu', 'Cassie Carlill', 'https://robohash.org/etdelectusquam.png?size=250x250&set=set1', 'Pashkovskiy', false),
      ('cvoysey7@mashable.com', 'cvoysey7', 'nVrJLWJ', 'Cybil Voysey', 'https://robohash.org/dolorcumquetenetur.png?size=250x250&set=set1', 'Matahuasi', false),
      ('ccantero8@usda.gov', 'ccantero8', 'MlwMS9fL', 'Clarine Cantero', 'https://robohash.org/nostrumetvoluptas.png?size=250x250&set=set1', 'Osinniki', false),
      ('rnavarro9@blogs.com', 'rnavarro9', 'qRrYy6gqM2', 'Rodrick Navarro', 'https://robohash.org/sitquoanimi.png?size=250x250&set=set1', 'Campo Verde', true);
      `)
  } catch (error) {
    console.error('erroror adding users to users table', error)
    throw error
  }
  console.log('Finished adding users!');
};

const createInitialProducts = async () => {
  console.log('Adding initial products to "Products" table...');
  try {
    client.query(`
      INSERT INTO products(title, description, price, img, "artistId")
      VALUES
      ('Profound homogeneous emulation', 'utilize granular metrics', '$33.61', 'http://dummyimage.com/179x100.png/cc0000/ffffff', 0),
      ('Multi-tiered background circuit', 'iterate impactful e-services', '$17.43', 'http://dummyimage.com/231x100.png/cc0000/ffffff', 0),
      ('Mandatory bi-directional protocol', 'syndicate next-generation synergies', '$8.91', 'http://dummyimage.com/174x100.png/ff4444/ffffff', 4),
      ('Grass-roots 5th generation Graphic Interface', 'architect cross-media e-services', '$46.09', 'http://dummyimage.com/235x100.png/dddddd/000000', 0),
      ('Decentralized methodical array', 'streamline B2C schemas', '$1.87', 'http://dummyimage.com/151x100.png/5fa2dd/ffffff', 0),
      ('Decentralized stable workforce', 'redefine sexy e-markets', '$5.85', 'http://dummyimage.com/104x100.png/dddddd/000000', 4),
      ('Multi-tiered 24 hour core', 'engineer 24/7 communities', '$49.25', 'http://dummyimage.com/128x100.png/5fa2dd/ffffff', 0),
      ('Reactive foreground success', 'generate efficient content', '$41.32', 'http://dummyimage.com/224x100.png/cc0000/ffffff', 6),
      ('Synergistic empowering initiative', 'generate viral communities', '$39.09', 'http://dummyimage.com/176x100.png/5fa2dd/ffffff', 6),
      ('Persistent multi-tasking customer loyalty', 'whiteboard collaborative eyeballs', '$25.70', 'http://dummyimage.com/138x100.png/ff4444/ffffff', 6);
      `)
  } catch (error) {
    console.error('erroror adding products to products table', error)
    throw error
  }
  console.log('Finished adding products!');
}

const rebuildDB = async () => {
  try {
    await client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
  } catch (erroror) {
    console.erroror('erroror during rebuildDB', erroror);
    throw erroror;
  } finally {
    await client.end();
    console.log("Database has been rebuilt, and you're good to go!");
  }
};

rebuildDB();
