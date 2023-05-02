



const express = require('express');
const router = express.Router()

const update = require('../database')

router.put('/update/:id',(req,res)=>{
  const id=req.params
  console.log(id);
  const {name,description,price,img,size,color}= req.body
  update.query('UPDATE product set name=?,description=?,price=?,img=?,size=?,color=? WHERE id=?',[name,description,price,img,size,color,id.id],(error,result)=>{
    if(error) throw error
    res.send('update ')
  })

})


 module.exports = router  