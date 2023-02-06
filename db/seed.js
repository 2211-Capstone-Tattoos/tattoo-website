const { addProductToCart } = require('./cart');
const { client } = require('./client');
const { completeOrder } = require('./orders');
const { getProducts, createProduct } = require('./products');
const { createUser } = require('./users');

const dropTables = async () => {
  try {
    console.log('Starting to drop all tables...');
    await client.query(`
    DROP TABLE IF EXISTS order_products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    `);
    console.log('Finished droppping all tables successfully!');
  } catch (error) {
    console.error('Error dropping tables');
    throw error;
  }
};

const createTables = async () => {
  try {
    console.log('Starting to create all tables...');
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      username VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      fullname VARCHAR(255),
      profile_img TEXT,
      location VARCHAR(255),
      is_artist BOOLEAN DEFAULT false,
      admin BOOLEAN DEFAULT false,
      deleted BOOLEAN DEFAULT false,
      description TEXT
    );
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price MONEY NOT NULL,
      img TEXT,
      active BOOLEAN NOT NULL DEFAULT true,
      "artistId" INTEGER REFERENCES users(id) NOT NULL
    );
    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      is_complete BOOLEAN NOT NULL DEFAULT false,
      total MONEY,
      ordered_at TIMESTAMPTZ ,
      "userId" INTEGER REFERENCES users(id) NOT NULL
    );
    CREATE TABLE order_products(
      id SERIAL PRIMARY KEY,
      img TEXT,
      title VARCHAR(255),
      description TEXT,
      paid_price MONEY,
      quantity INTEGER,
      "orderId" INTEGER REFERENCES orders(id) NOT NULL,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      UNIQUE ("orderId", "productId") 
    );
    `);
    console.log(
      'Finished creating all tables successfully! Now, to add some data!'
    );
  } catch (error) {
    console.error('Error creating tables');
    throw error;
  }
};

const createInitialUsers = async () => {
  console.log('Adding initial users to "Users" table...');
  const users = [
    {
      email: "tmainds0@google.co.jp",
      username: "tmainds0",
      password: "lJ1c3FuiU",
      fullname: "Thorsten Mainds",
      profileImg: "https://robohash.org/etquasullam?size=500x500&set=set1",
      location: "Vila",
      isArtist: false
    },
    {
      email: "dblitzer1@dailymail.co.uk",
      username: "dblitzer1",
      password: "pUW8UcRKydCp",
      fullname: "Delmore Blitzer",
      profileImg: "https://robohash.org/voluptatemidaut?size=500x500&set=set1",
      location: "Maracanã",
      isArtist: true,
      admin: true,
      description: "I am the best artist ever brother! You will never be disappointed with what I can do."
    },
    {
      id: 3,
      email: "thazelden2@t-online.de",
      username: "thazelden2",
      password: "e1N5Yct6O",
      fullname: "Tonnie Hazelden",
      profileImg: "https://robohash.org/essesitreiciendis?size=500x500&set=set1",
      location: "San Pedro",
      isArtist: true,
      deleted: true
    },
    {
      email: "begglestone3@skyrock.com",
      username: "begglestone3",
      password: "hXjoO5C",
      fullname: "Brendis Egglestone",
      profileImg: "https://robohash.org/voluptateaspernaturtempora?size=500x500&set=set1",
      location: "Belo Oriente",
      isArtist: true
    },
    {
      email: "arostron4@prlog.org",
      username: "arostron4",
      password: "F4pEfs",
      fullname: "Aimil Rostron",
      profileImg: "https://robohash.org/corporismolestiasqui?size=500x500&set=set1",
      location: "Palaihari",
      isArtist: false
    },
    {
      email: "bnixon5@scribd.com",
      username: "bnixon5",
      password: "9tvI2A",
      fullname: "Barry Nixon",
      profileImg: "https://robohash.org/rerumsequipraesentium?size=500x500&set=set1",
      location: "Santa Gertrudes",
      isArtist: false
    },
    {
      email: "tparlet6@goodreads.com",
      username: "tparlet6",
      password: "drXLIa8UhUD",
      fullname: "Tildie Parlet",
      profileImg: "https://robohash.org/odioautin?size=500x500&set=set1",
      location: "Lorica",
      isArtist: false
    },
    {
      email: "ppanchen7@networkadvertising.org",
      username: "ppanchen7",
      password: "FnWtMzqsef",
      fullname: "Paolina Panchen",
      profileImg: "https://robohash.org/consecteturexpeditaquidem?size=500x500&set=set1",
      location: "Quinipot",
      isArtist: false
    },
    {
      email: "ijackson8@pinterest.com",
      username: "ijackson8",
      password: "pTYJ4YaFz",
      fullname: "Issi Jackson",
      profileImg: "https://robohash.org/doloranimiaccusantium?size=500x500&set=set1",
      location: "Binuangan",
      isArtist: false
    },
    {
      email: "cde0@rediff.com",
      username: "ChiquiChiqui",
      password: "eFScjkGl",
      fullname: "Chiquia De Ruggiero",
      profileImg: "https://robohash.org/odioquiaculpa?size=500x500&set=set1",
      location: "Xishaqiao",
      isArtist: true
    },
    {
      email: "newguest0@rediff.com"
    }
  ]
  const newList = []
  try {
    while (users.length) {
      const user = users.shift();
      newList.push(await createUser(user))
    }
    console.log('Finished adding users!');
    return newList
  } catch (error) {
    console.error('Error adding users to users table', error)
    throw error
  }
};

const createInitialProducts = async () => {
  console.log('Adding initial products to "Products" table...');
  try {
    const products = [
      {
        title: "Black Panther",
        description: "Majestic, black panther design symbolizes power, grace and mystery",
        price: "$20.00",
        img: "3",
        artistId: 2,
        active: true
      },
      {
        title: "Eagle",
        description: "Soaring eagle design represents freedom, and strength.",
        price: "$40",
        img: "2",
        artistId: 2,
        active: true
      },
      {
        title: "Dagger",
        description: "Sharp and striking dagger symbolizes protection, bravery and determination.",
        price: "$55",
        img: "4",
        artistId: 2,
        active: true
      },
      {
        title: "Butterfly",
        description: "Beautiful butterfly represents transformation, hope, and renewal",
        price: "$23.82",
        img: "5",
        artistId: 3,
        active: true
      },
      {
        title: "Skull with Pipe and Top Hat",
        description: "This skull figure embodies nonconformity, wit and individuality.",
        price: "$37.84",
        img: "6",
        artistId: 3,
        active: true
      },
      {
        title: "Barn Swallow",
        description: "This elegant design represents love, freedom, and a journey.",
        price: "$21.34",
        img: "7",
        artistId: 3,
        active: true
      },
      {
        title: "Lucky Aces",
        description: "Four aces symbolize good luck, victory and success in gambling or life",
        price: "$22.98",
        img: "8",
        artistId: 4,
        active: true
      },
      {
        title: "Tiger",
        description: "Fierce tiger design represents power, bravery, and protection",
        price: "$37.74",
        img: "9",
        artistId: 4,
        active: true
      },
      {
        title: "Traditional Devil",
        description: "Intimidating demon face in American Tradition style embodies evil, fear, and strength",
        price: "$49.99",
        img: "10",
        artistId: 10,
        active: true
      },
      {
        title: "Skull and Crossbones",
        description: "Classic design that represents danger, rebellion and freedom.",
        price: "$35",
        img: "11",
        artistId: 10,
        active: true
      },
      {
        title: "Chinese Dragon",
        description: "Mythical Chinese dragon design symbolizes power, luck, and prosperity.",
        price: "$90",
        img: "12",
        artistId: 10,
        active: true
      },
      {
        title: "Pinup Girl",
        description: "Sultry pin-up girl embodies femininity, sexiness, and confidence.",
        price: "$45",
        img: "13",
        artistId: 10,
        active: true
      },
      {
        title: "Red Rose",
        description: "Eternal classic red rose symbolizes love, passion, and beauty.",
        price: "$35",
        img: "14",
        artistId: 10,
        active: true
      },
      {
        title: "Mermaid",
        description: "Seductive mermaid represents mystery, sensuality, and the ocean.",
        price: "$70",
        img: "15",
        artistId: 2,
        active: true
      },
      {
        title: "Snake",
        description: "Sly snake design represents temptation, danger, and cunning.",
        price: "$50",
        img: "16",
        artistId: 2,
        active: true
      },
      {
        title: "Anchor",
        description: "Sturdy anchro represents stability, security, and a steady journey.",
        price: "$50",
        img: "17",
        artistId: 3,
        active: true
      },
      {
        title: "M.O.M.",
        description: "This heartwarming classic design symbolizes love, pride, and  devotion to Mom of course.",
        price: "$39.99",
        img: "18",
        artistId: 3,
        active: true
      }
    ]


    const fetchProducts = Promise.all(products.map(async (product) => {
      await createProduct(product)
    }))
    console.log('Finished adding products!');
    return fetchProducts
  } catch (error) {
    console.error('Error adding products to products table', error)
    throw error
  }
}

const addInitialProductsToOrders = async (orderId) => {
  console.log("Adding initial products to orders")
  try {
    const productsToAdd = [
      {
        orderId: orderId,
        productId: 1,
        quantity: 2
      },
      {
        orderId: orderId,
        productId: 5,
        quantity: 3
      },
      {
        orderId: orderId,
        productId: 9,
        quantity: 10
      }
    ]
    const newCartProducts = Promise.all(productsToAdd.map(async (product) => {
      await addProductToCart(product)
    }))

    console.log("Finished adding initial products to orders")
    return newCartProducts
  } catch (err) {
    console.error('Error adding products to orders', err)
    throw err
  }
}

(async () => {
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await addInitialProductsToOrders(2); // del daddy's first cart
    await completeOrder(2, 2) // purchase first cart
    await addInitialProductsToOrders(12); // del daddy's second cart
  } catch (error) {
    console.error('Error during rebuildDB', error);
    throw error;
  } finally {
    console.log("Database has been rebuilt, and you're good to go!");
    await client.end()
    console.log('Pool ended')
  }
})();

