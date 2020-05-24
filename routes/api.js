const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
module.exports = router

const fetchData = async (tag) => {
   try{
        const response = await fetch(`https://hatchways.io/api/assessment/blog/posts?tag=${tag}`, {
            method : 'GET',
        });
        const result = await response.json();
        if(result.error) return []; 
        return result.posts;

   }catch(err){
        res.send(err);
   }   
}
//api home
router.get('/', async (req,res) => {
    res.status(200).send('This is app home');
});
//ping api
router.get('/ping', async (req,res) => {
    try {
        res.status(200).json({success: 'true'});
    } catch (err) {
        res.status(400).json({error: err});
    }
});

//posts api
router.get('/posts', async (req,res) => {
    try {
        if(req.query.tags){
            const allData = await getData(req);
            const sortBy = (typeof req.query.sortBy !== "undefined") ? req.query.sortBy : false;
            const sortByTypes = ["", "id", "likes", "reads", "popularity"];
            const direction = (typeof req.query.direction !== "undefined") ? req.query.direction : false;
            const directionTypes = ["desc", "asc"];
            
            if(sortBy){
                if(!(sortByTypes.includes(sortBy))){
                        res.status(400).json({error: 'sortBy parameter is invalid'});
                        return;
                }
                else if(!direction && !(directionTypes.includes(direction))) {
                    res.status(400).json({error: 'sortBy parameter is invalid'});
                    return;
                }
                await sortData(sortBy,direction, allData);    
            } 
            res.status(200).json({posts:allData});
        }else{
            res.status(400).json({error: 'Tags parameter is required'});
        }
        
    } catch (err) {
        res.status(400).send(err);
    }
});

const getData = async (req, data =[]) => {
    const output= [];
    const tags = await req.query.tags.split(',');
    for(let i = 0;i<tags.length;i++){
        const tagData = await fetchData(tags[i]);
        data = [...data, ...tagData];
    }
    //remove Duplicates
    let temp = {};
    for(let i=0 ; i< data.length; i++) {
        const key = data[i]['id'];  // supposing id prop to be unique
        if(!temp[key]) {
            temp[key] = true;
            output.push(data[i]);
        }
    }
    return output;        
}

const sortData = async (sortBy, direction, allData) => {

    if(sortBy === '' || sortBy === 'id'){
       await allData.sort((obj1,obj2) => {
            if(direction === 'desc') return obj2.id - obj1.id;
            return obj1.id - obj2.id;
        });
    }
    else if(sortBy === 'reads') {
        await allData.sort((obj1,obj2) => {
            if(direction === 'desc') return obj2.reads - obj1.reads;
            return obj1.reads - obj2.reads;
        });
    }
    else if(sortBy === 'likes' ) {
        await allData.sort((obj1,obj2) => {
            if(direction === 'desc') return obj2.likes - obj1.likes;
            return obj1.likes - obj2.likes;
        });
    }
    else if(sortBy === 'popularity') {
        await allData.sort((obj1,obj2) => {
            if(direction === 'desc') return obj2.popularity - obj1.popularity;
            return obj1.popularity - obj2.popularity;
        });
    }        
} 
