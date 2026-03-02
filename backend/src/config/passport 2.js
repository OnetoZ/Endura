const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Look for existing user with this googleId
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // 2. If no googleId match, try to find by email (existing account)
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Link Google account to existing email account
                    user.googleId = profile.id;
                    user.avatar = user.avatar || profile.photos[0]?.value;
                    await user.save();
                    return done(null, user);
                }

                // 3. Create brand new user
                user = await User.create({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0]?.value,
                    password: `google_${profile.id}_${Date.now()}`, // placeholder, not used
                    isVerified: true,
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize/Deserialize for session (used only for OAuth redirect flow)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
