# 🎬 Finnkinon elokuva sovellus

 Elokuvien tiedonhakusovellus, joka käyttää reaaliaikaisia tietoja Finnkino REST API:sta. Käyttäjät voivat selata eri Suomen teattereissa esitettävien elokuvien tietoja, katsoa näytösaikoja ja etsiä elokuvia mukautetulla hakukentällä.

## 🌐 Ominaisuudet

- Valitse teatteri pudotusvalikosta
- Näe käynnissä olevat elokuvat sekä näytösajat valitussa teatterissa
- Mukautettu hakukenttä elokuvan nimien suodattamiseen

## 📡 Tietolähteet

 Tämä sovellus käyttää Finnkino REST API:ta reaaliaikaisen elokuvan ja aikataulujen tiedon hakemiseen.

- Elokuva lista: `http://www.finnkino.fi/xml/TheatreAreas/`
- Aikataulut: `http://www.finnkino.fi/xml/Schedule/?area=<TheatreID>`
- API: [Finnkino XML Feed](http://www.finnkino.fi/xml)

