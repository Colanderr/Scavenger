var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID
var db
var nodes
var users

function nodesByUser(user, callback) {
	users.find({
		name: user
	}).each(function(err, doc) {
		if (doc != null) {
			var out = []
			for (var i = 0; i < doc.nodes.length; i++) {
				console.dir(i + " " + doc.nodes[i])
				nodeByID(doc.nodes[i], function(err, docum) {
					console.log(i)
					out[i] = docum
					if (i == doc.nodes.length - 1) {
						callback(err, out)
					}
				})
			}
		}
	})
}

function addUser(name, email) {
	users.findOne({
		"name": name
	}, function(err, doc) {
		if (doc == null) {
			console.log("name unique")
			users.findOne({
				"email": email
			}, function(err, doc) {
				if (doc == null) {
					users.insert({
						name: name,
						email: email,
						nodes: []
					}, {}, function(err, doc) {
						if (!err) console.log("NEW USER: " + name)
					})
				}
			})
		}
	})

}

function addNode(user, qr, lat, lng, headline, description, tags) {
	nodes.insert({
		user: user, //founder of the node
		qr: qr, //the confirmation QR code
		lat: lat, //location lat
		lng: lng, //location lng
		visitors: [],
		headline: headline,
		description: description,
		tags: tags
	}, {}, function(err, doc) {
		if (err) {
			console.log(err)
		} else {
			console.log("NEW NODE: user: " + user + " qr: " + qr + " headline: " + headline)
		}
	})
}

function claimNode(email, qr, nodeID, callback) {
	var node = getNodeByID(nodeID, function(doc) {
		if (doc.qr == qr) {
			console.log("QR OK")
			users.update({
				"email": email
			}, {
				"$addToSet": {
					"nodes": nodeID
				}
			})
			nodes.update({})
			callback("success")
		}
	})
}

function getNodeByID(id, callback) { //NOVE
	nodes.findOne({
		_id: new mongo.ObjectID(id)
	}, function(err, doc) {
		callback(doc)
	})
}

function getUserID(user, callback) {
	users.find({
		name: user
	}).each(function(err, doc) {
		if (doc != null) {
			callback(err, doc.name)
		}
	})
}

function getMapNodes(callback) {
	nodes.find().toArray(function(err, docs) {
		callback(docs.map(function(doc) {
			return {
				headline: doc.headline,
				description: doc.description,
				lat: doc.lat,
				lng: doc.lng,
				id: doc._id
			}
		}))
	})
}

function purge() {
	users.update({}, {
		"$set": {
			"nodes": []
		}
	})
}

MongoClient.connect("mongodb://localhost:27017/scavenger", function(err, database) {
	db = database;
	nodes = db.collection("nodes")
	users = db.collection("users")
	if (!err) {
		console.log("Databese connected")
		addUser("Colander", "jan.boucek.lol@gmail.comm")
			/*getNodeByID("569138a0b2d4854947c48bd1", function(doc) {
					console.dir(doc)
				})*/
			//add node: user, qr, lat, lng, headline, description
			//addNode("testUser", "testQR", 50.08414, 14.40835, "Mimina na kampě", "Nějaký supr dupr popis mimin na kampě, určitě bych doporučil všem :). Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ")

		//	addUser("testUser","dawdaw","random idAWDAWD", "e.mail@email.com")


		//var id = users.find()[1]
		//console.dir(id)
	}
})
module.exports.getMapNodes = getMapNodes
module.exports.getNodeByID = getNodeByID
module.exports.claimNode = claimNode
module.exports.purge = purge