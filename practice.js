//import thư viện fs
const fs = require('fs');
//import express
const express = require('express');
//Tạo 1 biến chứa các thuộc tính bên trong của class express
const app = express();
//middleware
app.use(express.json());
//Dùng để hiểu Json được gửi lên server
//Không liên quan đến vc đọc file

//Đọc file
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
console.log(tours);
//Get all Tour
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    quantity: tours.length,
    data: {
      tours,
    },
  });
});

//Get 1 tour
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Value',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(401).json({
      status: 'failed',
      message: 'Invalid Value',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
});

app.listen(4000, () => {
  console.log('The server is listening....');
});
