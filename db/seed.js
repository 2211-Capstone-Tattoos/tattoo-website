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
      admin BOOLEAN DEFAULT false
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
      profileImg: "https://robohash.org/etquasullam.png?size=500x500&set=set1",
      location: "Vila",
      isArtist: false
    },
    {
      email: "dblitzer1@dailymail.co.uk",
      username: "dblitzer1",
      password: "pUW8UcRKydCp",
      fullname: "Delmore Blitzer",
      profileImg: "https://robohash.org/voluptatemidaut.png?size=500x500&set=set1",
      location: "Maracanã",
      isArtist: true,
      admin: true
    },
    {
      id: 3,
      email: "thazelden2@t-online.de",
      username: "thazelden2",
      password: "e1N5Yct6O",
      fullname: "Tonnie Hazelden",
      profileImg: "https://robohash.org/essesitreiciendis.png?size=500x500&set=set1",
      location: "San Pedro",
      isArtist: true
    },
    {
      email: "begglestone3@skyrock.com",
      username: "begglestone3",
      password: "hXjoO5C",
      fullname: "Brendis Egglestone",
      profileImg: "https://robohash.org/voluptateaspernaturtempora.png?size=500x500&set=set1",
      location: "Belo Oriente",
      isArtist: true
    },
    {
      email: "arostron4@prlog.org",
      username: "arostron4",
      password: "F4pEfs",
      fullname: "Aimil Rostron",
      profileImg: "https://robohash.org/corporismolestiasqui.png?size=500x500&set=set1",
      location: "Palaihari",
      isArtist: false
    },
    {
      email: "bnixon5@scribd.com",
      username: "bnixon5",
      password: "9tvI2A",
      fullname: "Barry Nixon",
      profileImg: "https://robohash.org/rerumsequipraesentium.png?size=500x500&set=set1",
      location: "Santa Gertrudes",
      isArtist: false
    },
    {
      email: "tparlet6@goodreads.com",
      username: "tparlet6",
      password: "drXLIa8UhUD",
      fullname: "Tildie Parlet",
      profileImg: "https://robohash.org/odioautin.png?size=500x500&set=set1",
      location: "Lorica",
      isArtist: false
    },
    {
      email: "ppanchen7@networkadvertising.org",
      username: "ppanchen7",
      password: "FnWtMzqsef",
      fullname: "Paolina Panchen",
      profileImg: "https://robohash.org/consecteturexpeditaquidem.png?size=500x500&set=set1",
      location: "Quinipot",
      isArtist: false
    },
    {
      email: "ijackson8@pinterest.com",
      username: "ijackson8",
      password: "pTYJ4YaFz",
      fullname: "Issi Jackson",
      profileImg: "https://robohash.org/doloranimiaccusantium.png?size=500x500&set=set1",
      location: "Binuangan",
      isArtist: false
    },
    {
      email: "cde0@rediff.com",
      username: "ChiquiChiqui",
      password: "eFScjkGl",
      fullname: "Chiquia De Ruggiero",
      profileImg: "https://robohash.org/odioquiaculpa.png?size=500x500&set=set1",
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
        title: "Common brushtail possum",
        description: "In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.",
        price: "$21.47",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 2,
        active: true
      },
      {
        title: "Cat, ringtail",
        description: "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo.",
        price: "$48.09",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 2,
        active: true
      },
      {
        title: "Asian red fox",
        description: "Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti.",
        price: "$20.63",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 2,
        active: true
      },
      {
        title: "Albatross, waved",
        description: "Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
        price: "$23.82",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 3,
        active: true
      },
      {
        title: "Waved albatross",
        description: "Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio.",
        price: "$37.84",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 3,
        active: true
      },
      {
        title: "Water moccasin",
        description: "Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla.",
        price: "$21.34",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 3,
        active: true
      },
      {
        title: "Radiated tortoise",
        description: "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
        price: "$22.98",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 4,
        active: true
      },
      {
        title: "Mountain lion",
        description: "Nullam molestie nibh in lectus. Pellentesque at nulla.",
        price: "$37.74",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 4,
        active: true
      },
      {
        title: "Kiskadee, great",
        description: "Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
        price: "$15.86",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 10,
        active: true
      },
      {
        title: "Tern, royal",
        description: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla.",
        price: "$34.45",
        img: "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        artistId: 10,
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
  debugger
  console.log("Adding initial products to orders")
  debugger
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
    await client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await addInitialProductsToOrders(2); // del daddy's first cart
    await completeOrder(2, 2) // purchase first cart
    await addInitialProductsToOrders(11); // del daddy's second cart
  } catch (error) {
    console.error('Error during rebuildDB', error);
    throw error;
  } finally {
    console.log("Database has been rebuilt, and you're good to go!");
    await client.end();
  }
})();

