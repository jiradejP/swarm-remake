const express = require('express');
const solrNumRoutes = express.Router();
const SolrNode = require('solr-node');

let client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'DocNum',
    protocol: 'http'
});

solrNumRoutes.route('/add').post(function(req, res) {
    const data = {
        id: req.body.id,
        text: req.body.text
    }

    console.log(data)
    // Add Data to solr
    client.update(data, function(err, obj){
        if(err){
            console.log(err);
        } 
        
        console.log('Solr resopnse:', obj)
        
    })

    return res;
});

solrNumRoutes.route('/search').post(function(req, res) {
    console.log(req.body)
    let id = [];
    let Query = client.query()
                      .q(req.body)
                      .start(0);
    client.search(Query, function (err, result) {
        if (err) {
            console.log(err);
        }

        result.response.docs.forEach(element => {
            id.push(element.id)
        });

        console.log(id)
        res.json(id)
    });
    return res;
});


module.exports = solrNumRoutes;