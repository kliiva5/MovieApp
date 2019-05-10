# MovieApp
## Üldine info
Tegemist on mobiilirakendusega mille kaudu saab otsida filme ja lisada neid lemmikutesse. Idee tekkis kuna kõigil on filme mida keegi soovitab või ise tahaks vaadata kuid läheb meelest ära, antud App aitab sellest murest lahti saada. Igal filmil on olemas detail-vaade. Valisime React-Native arenduseks kuna tundus huvitav ja annab võimaluse juurde õppida.

## Alla laadimine
Rakenduse testimiseks tuleks endale antud rakendus alla laadida .zip failina ( ning lahti pakkida ) või siis käsureal:
```
git clone https://github.com/kliiva5/MovieApp.git
```

## Paigaldamine ja käivitamine
Tuleb navigeerida käsureal ennast MovieApp kausta. Veenduda, et kaustas asub package.json fail. vajalike pakettide alla laadimiseks käivitada käsk : 
```
npm install
```

Rakenduse käivitamiseks tuleb Android studio tööle panna ja avada MovieApp/android kaust. Käsureal olles samas kaustas us npm install sai tehtud, sisestada käsk : 
```
npm start
```

Android studios käivitada emulaator kuhu ilmub rakendus.

## Peamised kasutatud sõltuvused (dependencies)
* [Firebase](https://firebase.google.com/docs) - Andmebaas
* [React](https://reactjs.org/docs/getting-started.html) - Kasutajaliides
* [React Navigation](https://reactnavigation.org/docs/en/getting-started.html) - Rakenduse siseseks navigeerimiseks
* [React-Native](https://facebook.github.io/react-native/docs/getting-started) - Platvorm millega rakendus loodi

## Pildid projekti vaadetest
![home_page](https://www.upload.ee/image/9945200/homepage.png)
![movielist_page](https://www.upload.ee/image/9945204/movielist.png)
![moviedetails_page](https://www.upload.ee/image/9945202/moviedetails.png)
![about_page](https://www.upload.ee/image/9945191/aboutpage.png)
