/*
	Creator Table:
    1. Name - String
    2. Email - String
    3. Password - String
    4. Profile Image - Image
    8. PayPal Account - String (email)
    9. Description - String
    10. Welcome Video - String(Youtube Link)

    Reward Table:
    1. Name - String
    2. Image - String
    3. Price - Number
    4. Description - String
*/

module.exports = {
	InsertCreator : function (req, res, client){
        const query = 'INSERT INTO creators (email, name, phone, address, city) VALUES (?,?,?,?,?)'; 
        const params = [ post.email, post.name, post.phone, post.address, post.city ];
		client.execute(function(err, keyspace){
		    if(err){
		    	throw(err);
		    } else {
		    	var post = req.body;
				client.cql("INSERT INTO creators (email, name, phone, address, city) VALUES (?,?,?,?,?)", [post.email, post.name, post.phone, post.address, post.city], function(err, results){
					res.redirect('/');
				});
		    }
        });
        // Set the prepare flag in the query options
        client.execute(query, params, { prepare: true })
        .then(result => console.log('Row updated on the cluster'));
	},
	UpdateCreator : function (req, res, client){
        var post = req.body;
        const query = 'UPDATE creators SET name = ?, phone = ?, address = ?, city = ? WHERE id = ?'; 
        const params = [ post.name, post.phone, post.address, post.city, post.id ];
		client.execute(function(err, keyspace){
		    if(err){
		    	throw(err);
		    } else {
		    	var post = req.body;
				client.cql("UPDATE creators SET name = ?, phone = ?, address = ?, city = ? WHERE id = ?", [post.name, post.phone, post.address, post.city, post.id], function(err, results){
					res.redirect('/');
				});
		    }
		});
	},
	DeleteCreator : function (req, res, client){
        var post = req.body;
        const query = 'DELETE FROM creators WHERE id = ?'; 
        const params = [ post.id ];
        // Set the prepare flag in the query options
        client.execute(query, params, { prepare: true })
	},
	LoadCreator : function (client, id, res){
		// const query = 'SELECT * FROM creator WHERE email = ' + email;
		const query = 'SELECT * FROM creator';

		client.execute(query, function (err, result) {
			var data = '{"name":"'+result.rows[0].name+'", "description":"'+result.rows[0].description+'", "profile_picture":"'+result.rows[0].img_src+'", "cover_picture":"'+result.rows[0].img_src+'", "intro_video":"'+result.rows[0].img_src+'", "date":"'+result.rows[0].created_at+'"}'
			return res(null, data);
		});
	},
	LoadCreators : function (client, ids){
		const query = 'SELECT * FROM creators WHERE category_id in (?)';
        // Set the prepare flag in the query options
        // client.execute(query, [ids] function (err, result) {
		// 	return (result.rows[0]);
		// });
		return '{"creators":[{"name":"John", "description":"Doe", "profile_picture":"picture", "cover_picture":"cover_picture", "intro_video":"intro_video"}, {"name":"John2", "description":"Doe2", "profile_picture":"picture2", "cover_picture":"cover_picture2", "intro_video":"intro_video2"}]}';
	}
}