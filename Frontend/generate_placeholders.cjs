const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src', 'assets');
if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
const b = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
const names = ['rolex1.jpg','rolex2.jpg','rolex3.jpg','omega1.jpg','omega2.jpg','omega3.jpg','patek1.jpg','patek2.jpg','patek3.jpg','audemars1.jpg','audemars2.jpg','audemars3.jpg'];
names.forEach(n => fs.writeFileSync(path.join(p, n), b));
console.log('Dummy images created!');
