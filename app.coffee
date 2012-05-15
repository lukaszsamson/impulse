express = require 'express'
#connect = require 'connect'
app = express()
#io = require('socket.io').listen(app)


module.exports = app
# CONFIGURATION

app.configure(() ->
  app.set 'view engine', 'jade'
  app.set 'views', "#{__dirname}/views"
  #app.set 'view options', pretty: true
  app.use express.bodyParser()
  app.use express.static(__dirname + '/public')
  app.use express.cookieParser('tobo!')
  app.use express.cookieSession({ cookie: { maxAge: 60 * 60 * 1000 }})
  app.use express.logger()
  app.use express.methodOverride()
  app.use app.router
)

app.configure 'development', () ->
	app.use express.errorHandler({
		dumpExceptions: true
		showStack     : true
	})

app.configure 'production', () ->
	app.use express.errorHandler()

app.locals.use (req, res, done) ->
  res.locals.session = req.session
  done()

  
# ROUTES
emails = []
app.get '/splash', (req, res) ->
  res.render 'splash',
  title: 'Welcome'

app.post '/signUp', (req, res) ->
  emails.push req.body.email
  res.partial 'thanks'
    
app.get '/home', (req, res) ->
  res.render 'index',
    title: 'Html 5 demo'
    id: 'home'

im = []

getDistance = (lng1, lat1, lng2, lat2) ->
  R = 6371
  dLat = (lat2 - lat1) * Math.PI / 180
  dLon = (lng2 - lng1) * Math.PI / 180
  lat1r = lat1 * Math.PI / 180
  lat2r = lat2 * Math.PI / 180

  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1r) * Math.cos(lat2r)
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  R * c

getImpulse = (req, res, next) ->
  id = req.params.id
  f = im.filter (i) -> i.id == id
  if f.length == 0
    return next(new Error("Impulse #{id} not found"))
  req.impulse = f[0]
  next()
  
authorize = (req, res, next) ->
  if req.session.currentUser
    next()
  else
    next(new Error("Authorization required"))
  
app.get '/', (req, res, error) ->
  res.render 'main',
    title: 'im-pulse'
    id: 'home'
    myImpulses: im.filter (i) ->
      i.users.indexOf(req.session.currentUser) != -1
    

app.post '/login', (req, res, error) ->
  req.session.currentUser = req.body.userId
  res.redirect '/'
  
app.post '/logout', (req, res, error) ->
  delete req.session.currentUser
  res.redirect '/'

app.get '/im/search', (req, res) ->
  res.render 'imsearch',
    id: 'home'
    title: "Search Impulse"
    myImpulses: im.filter (i) ->
      i.users.indexOf(req.session.currentUser) != -1
  
app.get '/im', (req, res) ->
  lat = req.param('lat', NaN)
  lng = req.param('lng', NaN)
  
  res.render 'imlist',
    id: 'home'
    title: "Search results"
    myImpulses: im.filter (i) ->
      i.users.indexOf(req.session.currentUser) != -1
    foundImpulses: im.map (i) ->
      id: i.id
      name: i.name
      distance: getDistance lat, lng, i.lat, i.lng
  
app.post '/im', authorize, (req, res, error) ->
  id = Math.floor(Math.random()*10000).toString()
  user = req.session.currentUser
  im.push
    id: id
    name: req.body.name
    creator: user
    createDate: new Date()
    membersNeeded: parseInt req.body.membersNeeded
    lat: parseFloat req.body.lat
    lng: parseFloat req.body.lng
    address: req.body.address
    users: [user]
    messages: [
      date: new Date()
      text: "#{user} starts the enterprise"
      author: 'System'
    ]
  res.redirect "/im/#{id}"

app.get '/im/:id', getImpulse, (req, res, error) ->
  user = req.session.currentUser
  res.render 'im',
    id: 'home'
    title: "Impulse #{req.impulse.id}"
    myImpulses: im.filter (i) ->
      i.users.indexOf(req.session.currentUser) != -1
    impulse: req.impulse


app.post '/im/:id/join', getImpulse, authorize, (req, res, error) ->
  user = req.session.currentUser
  if req.impulse.users.indexOf(user) != -1
    return error 'already participating'
  req.impulse.users.push user
  req.impulse.messages.unshift
    date: new Date()
    text: "#{user} joins the enterprise"
    author: 'System'
  if req.impulse.users.length == req.impulse.membersNeeded
    req.impulse.messages.unshift
      date: new Date()
      text: "Required members gathered"
      author: 'System'
  res.redirect "/im/#{req.impulse.id}"

app.post '/im/:id/leave', getImpulse, authorize, (req, res, error) ->
  user = req.session.currentUser
  if req.impulse.users.indexOf(user) == -1
    return error 'not participating'
  req.impulse.users.splice(req.impulse.users.indexOf(user), 1)
  req.impulse.messages.unshift
    date: new Date()
    text: "#{user} leaves the enterprise"
    author: 'System'
  if req.impulse.users.length == req.impulse.membersNeeded - 1
    req.impulse.messages.unshift
      date: new Date()
      text: "More members needed"
      author: 'System'
  res.redirect "/im/#{req.impulse.id}"
  
app.get '/im/:id/msgs', (req, res, error) ->
  ms = find
  res.render 

app.post '/im/:id/msgs', getImpulse, authorize, (req, res, error) ->
  user = req.session.currentUser
  if req.impulse.users.indexOf(user) == -1
    return error 'not participating'
  req.impulse.messages.unshift
    date: new Date()
    text: req.body.text
    author: user
  res.redirect "/im/#{req.impulse.id}"





app.listen 1234, () -> console.log "Express server listening on port 1234"