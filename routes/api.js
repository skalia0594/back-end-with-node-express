const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
module.exports = router
// const {getData, sortData} = require('../helper');
// const sortData = require('../helper');

const fetchData = async (tag) => {
   try{
        const response = await fetch(`https://hatchways.io/api/assessment/blog/posts?tag=${tag}`, {
            method : 'GET',
        });
        const result = await response.json();
        if(result.error) return []; 
        // console.log(result);
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
        let alldata =[];
        // console.log(req.query);
        if(req.query.tags){
            alldata = await getData(req,alldata);
            if(req.query.sortBy || req.query.sortBy ===''){
                if(!(req.query.sortBy === '' || req.query.sortBy === 'id' || req.query.sortBy === 'likes'|| 
                    req.query.sortBy === 'reads' || req.query.sortBy === 'popularity')){
                        res.status(400).json({error: 'sortBy parameter is invalid'});
                        return;
                }
                else if(req.query.direction && !(req.query.direction==='desc' || req.query.direction === 'asc')) {
                    res.status(400).json({error: 'sortBy parameter is invalid'});
                    return;
                }
                await sortData(req, alldata);    
            } 
            // console.log(alldata.length);
            res.status(200).json({posts:alldata});
        }else{
            res.status(400).json({error: 'Tags parameter is required'});
        }
        
    } catch (err) {
        res.status(400).send(err);
    }
});

const getData = async (req, alldata) => {
    const tags = await req.query.tags.split(',');
    for(let i = 0;i<tags.length;i++){
        const tagData = await fetchData(tags[i]);
        for(let j=0 ; j<tagData.length;j++){
            await alldata.push(tagData[j]);
        } 
    }
    Object.values(alldata.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));  //remove duplicates
    return alldata;        
}

const sortData = async (req, alldata) => {

    if(req.query.sortBy === '' || req.query.sortBy === 'id'){
        console.log('entered:', req.query.direction);
       await alldata.sort((obj1,obj2) => {
            if(req.query.direction && req.query.direction === 'desc') return obj2.id - obj1.id;
            return obj1.id - obj2.id;
        });
    }
    else if(req.query.sortBy === 'reads') {
        await alldata.sort((obj1,obj2) => {
            if(req.query.direction && req.query.direction === 'desc') return obj2.reads - obj1.reads;
            return obj1.reads - obj2.reads;
        });
    }
    else if(req.query.sortBy === 'likes' ) {
        await alldata.sort((obj1,obj2) => {
            if(req.query.direction && req.query.direction === 'desc') return obj2.likes - obj1.likes;
            return obj1.likes - obj2.likes;
        });
    }
    else if(req.query.sortBy === 'popularity') {
        await alldata.sort((obj1,obj2) => {
            if(req.query.direction && req.query.direction === 'desc') return obj2.popularity - obj1.popularity;
            return obj1.popularity - obj2.popularity;
        });
    }        
} 
