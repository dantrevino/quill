var config = require('../config');

var Maki = require('maki');
var quill = new Maki(config);

var ObjectId = quill.mongoose.Schema.Types.ObjectId;

quill.use(require('maki-client-markdown'));
quill.use(require('maki-client-level'));

var Passport = require('maki-passport-local');
var passport = new Passport({
  resource: 'Author'
});

var Auth = require('maki-auth-simple');
var auth = new Auth({
  roles: ['admin']
});

quill.use(passport);
quill.use(auth);

var Index = quill.define('Index', {
  public: false,
  name: 'Index',
  handle: 'Home',
  components: {
    masthead: 'quill-pitch',
    query: 'quill-workspace',
    get: 'quill-index'
  },
  routes: {
    query: '/'
  }
});

var Author = quill.define('Author', {
  public: false,
  icon: 'users',
  description: 'The writers of RolePlayGateway.',
  attributes: {
    username: { type: String , max: 60 },
    password: { type: String , masked: true , max: 240 }
  }
});

var Universe = quill.define('Universe', {
  public: false,
  icon: 'book',
  description: 'Fictional worlds on RolePlayGateway.',
  attributes: {
    _creator: { type: ObjectId , ref: 'Author' , required: true },
    name: { type: String , max: 80 , slug: true , required: true },
    synopsis: { type: String , max: 240 },
    created: { type: Date , default: Date.now , required: true },
    edited: { type: Date },
    description: { type: String },
    rules: { type: String },
    stats: {
      posts: { type: Number , default: 0 },
      words: { type: Number },
      sentences: { type: Number },
      paragraphs: { type: Number },
      authors: { type: Number }
    }
  }
});

var Character = quill.define('Character', {
  public: false,
  icon: 'user',
  description: 'Characters in a world on RolePlayGateway',
  attributes: {
    name: { type: String , max: 160 , slug: true , required: true },
    synopsis: { type: String , max: 240 },
    description: { type: String },
    _universe: { type: ObjectId , ref: 'Universe' }
  }
});

var Quest = quill.define('Quest', {
  public: false,
  icon: 'protect',
  description: 'Quests for characters to take on.',
  attributes: {
    name: { type: String , max: 160 , slug: true , required: true },
    synopsis: { type: String , max: 240 },
    description: { type: String },
    _universe: { type: ObjectId , ref: 'Universe' }
  }
});

var Bundle = quill.define('Bundle', {
  public: false,
  icon: 'tags',
  description: 'Bundles of posts that make up interesting storyline arcs.',
  attributes: {
    name: { type: String , max: 160 , slug: true , required: true },
    synopsis: { type: String , max: 240 },
    description: { type: String },
    _universe: { type: ObjectId , ref: 'Universe' }
  }
});

var Place = quill.define('Place', {
  public: false,
  icon: 'globe',
  description: 'Settings in a Universe on RolePlayGateway.',
  attributes: {
    name: { type: String , max: 160 , slug: true },
    description: { type: String },
    stats: {
      posts: { type: Number , default: 0 },
      words: { type: Number },
      sentences: { type: Number },
      paragraphs: { type: Number },
      authors: { type: Number }
    }
  }
});

var Post = quill.define('Post', {
  public: false,
  icon: 'file text',
  description: 'Written content by an author.',
  components: {
    query: 'quill-workspace',
    get: 'quill-doc'
  },
  attributes: {
    //id: { type: String , id: true },
    author: { type: String , ref: 'Author' },
    _author: { type: ObjectId , ref: 'Author' , required: true },
    _place: { type: ObjectId , ref: 'Place' , required: true },
    _universe: { type: ObjectId , ref: 'Universe' , required: true },
    content: { type: String },
    created: { type: Date , default: Date.now , required: true },
    edited: { type: Date },
    stats: {
      words: { type: Number },
      sentences: { type: Number },
      paragraphs: { type: Number },
    }
  }
});

var Forum = quill.define('Forum', {
  public: false,
  icon: 'unordered list',
  description: 'Generalized discussion forums, to which Topics are posted.',
  attributes: {
    title: { type: String , slug: true , required: true , max: 80 },
    description: { type: String },
    created: { type: Date , default: Date.now , required: true },
    edited: { type: Date },
  }
});

var Topic = quill.define('Topic', {
  public: false,
  icon: 'idea',
  description: 'Discussion topics posted by authors on RolePlayGateway.',
  attributes: {
    _author: { type: ObjectId , ref: 'Author' },
    title: { type: String , slug: true , required: true , max: 80 },
    description: { type: String },
    created: { type: Date , default: Date.now , required: true },
    edited: { type: Date },
  }
});

var Comment = quill.define('Comment', {
  public: false,
  icon: 'comments',
  description: 'Comments by authors on various items.',
  attributes: {
    _author: { type: ObjectId , ref: 'Author' , required: true },
    content: { type: String },
    created: { type: Date , default: Date.now , required: true },
    edited: { type: Date },
  }
});

var Task = quill.define('Task', {
  public: false,
  icon: 'checkmark box',
  description: 'Queued tasks for manual review.',
  attributes: {
    _creator: { type: ObjectId , ref: 'Author' /*, required: true */ },
    _owner: { type: ObjectId , ref: 'Author' },
    created: { type: Date , default: Date.now , required: true },
    comment: { type: String },
    attachment: {
      id: { type: Number },
      type: { type: String , enum: ['content', 'quest', 'bundle', 'place', 'universe', 'comment', 'topic'] }
    }
  }
});

var Subscription = quill.define('Subscription', {
  public: false,
  icon: 'rss',
  description: 'A subscription to the Quill mailing list.',
  attributes: {
    email: { type: String , required: true },
    created: { type: Date , default: Date.now }
  },
  handlers: {
    html: {
      create: function redirectToRoot (req, res, next) {
        req.flash('success', 'Successfully subscribed!  We\'ll be in touch soon.');
        res.redirect(302, '/');
      }
    }
  }
});

var Doc = quill.define('Doc', {
  public: false,
  icon: 'page',
  description: 'A document in the network.',
  attributes: {
    id: { type: String , id: true },
    title: { type: String , max: 240 },
    content: { type: String },
    created: { type: Date , default: Date.now }
  },
  source: __dirname + '/../docs',
  components: {
    get: 'quill-doc'
  }
});

var Invitation = quill.define('Invitation', {
  public: false,
  icon: 'send',
  components: {
    masthead: 'maki-invitation-splash',
    query: 'maki-invitation-manager',
    get: 'maki-invitation-view',
  },
  attributes: {
    id: { type: String , required: true , slug: true },
    from: { type: String , max: 240 , authorize: 'user' },
    user: { type: String , max: 240 , ref: 'Person' },
    email: { type: String , required: true , max: 240 },
    avatar: { type: String },
    topics: [ { type: String } ],
    message: { type: String },
    created: { type: Date , default: Date.now },
    status: { type: String , enum: ['created', 'sent', 'accepted'] , default: 'created' },
    stats: {
      reminders: { type: Number , default: 0 },
      people: { type: Number , default: 1 }
    }
  },
  requires: {
    Topic: {
      query: {},
      sort: 'id'
    }
  },
});

Invitation.pre('create', function(next, done) {
  var invitation = this;

  if (invitation.email) {
    invitation.avatar = require('crypto').createHash('md5').update(invitation.email).digest('hex');
    invitation.id = invitation.avatar;
  }
  
  Invitation.get({ email: invitation.email }, function(err, user) {
    if (user) {
      return Invitation.patch({ id: user.id }, [
        { op: 'replace', path: '/stats/reminders', value: ++user.stats.reminders }
      ], function(err) {
        if (err) console.error(err);
        done(null, user);
      });
    } else {
      next();
    }
  });

});

Invitation.post('get', function(done) {
  var invitation = this;
  if (invitation.email) {
    invitation.avatar = require('crypto').createHash('md5').update(invitation.email).digest('hex');
    invitation.id = invitation.avatar;
  }
  done();
});

module.exports = quill;
