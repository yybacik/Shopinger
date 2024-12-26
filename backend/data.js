import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Yusuf',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      "name": "Ergonomic Wooden Chair",
      "slug": "ergonomic-wooden-chair",
      "image": "https://picsum.photos/seed/ergonomic-wooden-chair/600/400",
      "images": [
        "https://picsum.photos/seed/ergonomic-wooden-chair-1/600/400",
        "https://picsum.photos/seed/ergonomic-wooden-chair-2/600/400",
        "https://picsum.photos/seed/ergonomic-wooden-chair-3/600/400"
      ],
      "brand": "FurniCo",
      "category": "Furniture",
      "description": "A comfortable and stylish ergonomic wooden chair perfect for your home office.",
      "price": 149.99,
      "countInStock": 25,
      "rating": 4.5,
      "numReviews": 12,
      "reviews": [
        {
          "name": "Ahmet Yılmaz",
          "comment": "Çok rahat bir sandalye, ofis için mükemmel!",
          "rating": 5,
          "createdAt": "2024-01-15T10:20:30Z",
          "updatedAt": "2024-01-15T10:20:30Z"
        },
        {
          "name": "Elif Kaya",
          "comment": "Kaliteli malzeme ve şık tasarım.",
          "rating": 4,
          "createdAt": "2024-02-10T08:15:45Z",
          "updatedAt": "2024-02-10T08:15:45Z"
        }
      ]
    },
    {
      "name": "Wireless Bluetooth Headphones",
      "slug": "wireless-bluetooth-headphones",
      "image": "https://picsum.photos/seed/wireless-bluetooth-headphones/600/400",
      "images": [
        "https://picsum.photos/seed/wireless-bluetooth-headphones-1/600/400",
        "https://picsum.photos/seed/wireless-bluetooth-headphones-2/600/400",
        "https://picsum.photos/seed/wireless-bluetooth-headphones-3/600/400"
      ],
      "brand": "SoundMax",
      "category": "Electronics",
      "description": "Experience high-quality sound with these wireless Bluetooth headphones, featuring noise cancellation and long battery life.",
      "price": 89.99,
      "countInStock": 50,
      "rating": 4.7,
      "numReviews": 30,
      "reviews": [
        {
          "name": "Mehmet Can",
          "comment": "Harika ses kalitesi ve konforlu kullanım.",
          "rating": 5,
          "createdAt": "2024-03-05T12:00:00Z",
          "updatedAt": "2024-03-05T12:00:00Z"
        },
        {
          "name": "Zeynep Demir",
          "comment": "Batarya ömrü gerçekten uzun.",
          "rating": 4.5,
          "createdAt": "2024-04-12T09:30:25Z",
          "updatedAt": "2024-04-12T09:30:25Z"
        }
      ]
    },
    {
      "name": "Stainless Steel Kitchen Knife Set",
      "slug": "stainless-steel-kitchen-knife-set",
      "image": "https://picsum.photos/seed/stainless-steel-kitchen-knife-set/600/400",
      "images": [
        "https://picsum.photos/seed/stainless-steel-kitchen-knife-set-1/600/400",
        "https://picsum.photos/seed/stainless-steel-kitchen-knife-set-2/600/400",
        "https://picsum.photos/seed/stainless-steel-kitchen-knife-set-3/600/400"
      ],
      "brand": "ChefPro",
      "category": "Kitchen",
      "description": "A complete set of stainless steel kitchen knives for all your cooking needs, featuring ergonomic handles and sharp blades.",
      "price": 59.99,
      "countInStock": 40,
      "rating": 4.3,
      "numReviews": 18,
      "reviews": [
        {
          "name": "Ayşe Öztürk",
          "comment": "Keskin bıçaklar ve sağlam yapısı var.",
          "rating": 4,
          "createdAt": "2024-05-20T14:45:10Z",
          "updatedAt": "2024-05-20T14:45:10Z"
        },
        {
          "name": "Fatih Aydın",
          "comment": "Mutfakta işlerimi çok kolaylaştırdı.",
          "rating": 4.5,
          "createdAt": "2024-06-18T11:25:35Z",
          "updatedAt": "2024-06-18T11:25:35Z"
        }
      ]
    }
  ],
};
export default data;
