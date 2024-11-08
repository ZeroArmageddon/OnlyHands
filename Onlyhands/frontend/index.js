const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Google OAuth hitelesítési beállítások
passport.use(new GoogleStrategy({
    clientID: '1023319210082-jhf7pubcbkg3kmmmh5otoioatpblk18i.apps.googleusercontent.com', // Itt add meg a saját Google Client ID-t
    clientSecret: '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', // Itt add meg a saját Google Client Secret-et
    callbackURL: 'http://localhost:3000/auth/google/callback' // A redirect URI, ami az appodban működik
}, (accessToken, refreshToken, profile, done) => {
    // Felhasználó adatainak kezelése (itt például csak a profiladatokat mentjük)
    return done(null, profile);
}));

// Passport session kezelése
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Session kezelés
app.use(session({ secret: "secretkey", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Főoldal, ahol a bejelentkezés állapotát megjelenítjük
app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`<h1>Üdvözöllek, ${req.user.displayName}!</h1>
                  <a href="/logout">Kijelentkezés</a>`);
    } else {
        res.send('<h1>Üdvözlünk az oldalon!</h1><a href="/auth/google">Google-bejelentkezés</a>');
    }
});

// Google bejelentkezési útvonal, amely elindítja a hitelesítést
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback útvonal, ahová a Google visszairányít a sikeres bejelentkezés után
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // Sikeres bejelentkezés esetén átirányít a főoldalra
        res.redirect("/");
    }
);

// Kijelentkezés útvonal
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

// Szerver indítása
app.listen(3000, () => {
    console.log("A szerver fut a http://localhost:3000 címen");
});
