const translations = {
    PL: {
        title: "PH4.1",
        sectionTitles: {
            calculator: "Kalkulator",
            sourdough: "Zacznij swój zakwas",
            settings: "Ustawienia"
        },
        goBack:"Wróć",
        subTitle:"Pierwsza aplikacja do wypieków na zakwasie",
        productLabel: "Co pieczesz dzisiaj?",
        chooseOption: "Wybierz",
        bread: "Chleb",
        pizza: "Pizza",
        breadWeight: "Waga chleba (g):",
        tray:"Kształt blachy do pieczenia:",
        tray5cm:"Wybierz blachę o wysokości co najmniej 5 cm!",
        focaccia: "Focaccia",
        squareShape:"Prostokątny",
        roundShape:"Okrągły",
        calculate: "Oblicz",
        length:"Długość (cm):",
        width:"Szerokość (cm):",
        reset: "Reset",
        diameter:"Średnica (cm):",
        pcs:"Ile sztuk?",
        period:"Pora roku:",
        periodSuggest: "W ciepłe pory roku zużyjesz mniej zakwasu niż w zimne.",
        summer:"Wiosna-Lato",
        winter:"Jesień-Zima",
        water:"Hydratacja (%):",
        waterSuggest:"Jeśli nie masz dużego doświadczenia, zalecam pozostawienie domyślnego.",
        recipeDetails:"Szczegóły twojego przepisu",
        rec:"Przepis:",
        pieces:"Sztuki:",
        flour:"Mąka:",
        wat:"Woda:",
        salt:"Sól:",
        sourdough:"Zakwas:",
        oil:"Oliwa:",
        oil1:"łyżka",
        oil2:"łyżki",
        oil3:"łyżek",
        fatBoy:"Uwaga, wykryte obżartuch!",
        fatBoy1:"Rozumiem Twoją ochotę na ",
        fatBoy2:"specjalista dietetyk ",
        fatBoy3:"Dr. Drożdże ",
        fatBoy4:"zaraz cię przyjmie!",
        logout : "Wróć",
        sets:"Ustawienia",
        chatNow:"Napisz do mnie",
        createSourdough:"Zaczyn...amy!",
        calculatorButton:"Kalkulator",
        close:"Zamknij",
        teachMe:"Pomóż mi!",
        help:"Pomoc",
        contactTitle:"Napisz swoje zapytanie i metode kontaktu:",
        contactMessageRecipe:"Cześć Marco! Chciałbym nauczyć się więcej o tej recepturze :",
        contactMessageCalculator:"Cześć Marco! Potrzebuję pomocy z kalkulatorem.",
        products: {
            Chleb: "Chleb",
            Focaccia: "Focaccia",
            Pizza: "Pizza"
        },
        sourSlideTitles: {
            zero: "Czym jest zakwas?",
            one: "Początek",
            two: "Karmienie",
            three: "Konsystencja",
            four: "Ostatnie uwagi"
        },
        sourdough01:"Bukiet mikroorganizmów, które współistnieją w symbiozie w środowisku złożonym z wody i mąki, w" +
            " tym drożdże(zazwyczaj Saccharomyces cerevisiae) oraz bakterie kwasu mlekowego (Lactobacillus).",
        sourdough02: "Drożdże, odpowiedzialne za fermentację ciasta, wspomagane przez niektóre enzymy"+
            "(amilazy i proteazy), fermentują część cukrów zawartych w mące.",
        sourdough03: "Bakterie produkują kwas octowy i mlekowy,"+
            "które nadają produktowi końcowemu niezwykły smak i aromat,"+
            "wydłużają trwałość i mają korzystny wpływ na jelita.",

        sourdough11:"W słoiku o pojemności około 300 ml połącz 3 łyżki mąki pełnoziarnistej z odrobiną wrzącej wody\n" +
            "i wymieszaj, aż uzyskasz kremową konsystencję.",
        sourdough12:
            "Po 5 minutach dodaj łyżeczkę jogurtu naturalnego (bez cukru) lub kefiru i dokładnie wymieszaj.",
        sourdough13:
            "Przykryj słoik gazą lub ściereczką i pozostaw w kuchni w temperaturze pokojowej\n" +
            "na minimum 2 dni latem lub maksymalnie 4 dni zimą.\n" +
            "Jeśli pojawi się pleśń, zacznij od nowa.",
        sourdough21:"Wyrzuć górną połowę zawartości słoika i dodaj 2 łyżki mąki typu 00\n" +
            "(pszenna, orkiszowa lub semolina dwukrotnie mielona, o zawartości białka nie mniejszej niż 12%),\n" +
            "niepełnoziarnistej, oraz tyle wody, ile potrzeba, aby uzyskać pierwotną konsystencję.",
        sourdough22:
        "Mieszać, lekko zakręć słoik pokrywką i pozostaw do fermentacji w temperaturze co najmniej 21°C przez 24" +
        " godziny\n" +
        "(wyłączony piekarnik to idealne miejsce).",
        sourdough23:
        "Powtarzaj ten proces (tsw. 'karmienie') przez 4–5 dni, za każdym razem, gdy objętość zakwasu się podwoi.",
        sourdough31:"Wyrzuć górną połowę zawartości słoika i dodaj 3 łyżki mąki typu 00\n" +
            "(pszenna, orkiszowa lub semolina dwukrotnie mielona, o zawartości białka nie mniejszej niż 12%),\n" +
            "niepełnoziarnistej, szczyptę soli oraz 1 łyżkę wody, aby zakwas miał zwartą, ale plastyczną konsystencję.",
        sourdough32:
            "Dobrze wymieszaj, lekko zakręć słoik pokrywką i pozostaw do fermentacji w temperaturze co najmniej 21°C przez 24 godziny\n" +
            "(wyłączony piekarnik to idealne miejsce).\n",
        sourdough41:"Używaj zakwasu tylko wtedy, gdy jego objętość podwoi się po karmeniu!",
        sourdough42:
            "Podczas przygotowywania wypieku pamiętaj, aby zostawić niewielką część zakwasu w słoiku,\n" +
            "którą następnie odświeżysz i przechowasz w lodówce — tam może pozostać przez 2 dni,\n" +
            "czekając na kolejne pieczenie!",
        authErrors: {
            'empty-fields': 'Proszę wprowadzić e-mail i hasło.',
            'auth/invalid-email': 'Nieprawidłowy adres e-mail. Sprawdź i spróbuj ponownie.',
            'auth/user-disabled': 'Konto zostało wyłączone. Skontaktuj się z pomocą techniczną.',
            'auth/invalid-credential': 'Nieprawidłowe poświadczenia. Sprawdź e-mail i hasło.',
            'auth/email-already-in-use': 'Ten e-mail jest już zarejestrowany. Spróbuj zalogować się lub zresetować hasło.',
            'auth/weak-password': 'Hasło jest za słabe. Użyj co najmniej 6 znaków.',
            'auth/user-not-found': 'Nie znaleziono konta z tym adresem e-mail.',
            'auth/wrong-password': 'Nieprawidłowe hasło. Spróbuj ponownie.',
            'auth/too-many-requests': 'Zbyt wiele prób. Spróbuj ponownie później.',
            'auth/invalid-password': 'Nieprawidłowy format hasła.',
            'auth/network-request-failed': 'Błąd sieci. Sprawdź połączenie.',
        },
    },
    EN: {
        title: "PH4.1",
        sectionTitles: {
            calculator: "Calculator",
            sourdough: "Create your sourdough",
            settings: "Settings"
        },
        subTitle:"The first app for your sourdough creations",
        goBack:"Back",
        productLabel: "What are you gonna bake today?",
        chooseOption: "Choose",
        bread: "Bread",
        pizza: "Pizza",
        breadWeight: "Loaf Weight (g):",
        tray:"Baking tray shape:",
        focaccia: "Focaccia",
        squareShape:"Square-shaped",
        roundShape:"Round-shaped",
        tray5cm:"Choose a tray at least 5cm high!",
        calculate: "Calculate",
        length:"Length (cm):",
        width:"Width (cm):",
        reset: "Reset",
        diameter:"Diameter (cm):",
        pcs:"How many pieces?",
        sets:"Settings",
        period:"Season:",
        periodSuggest:"On summer time you want to use less sourdough than on winter time.",
        summer:"Spring-Summer",
        winter:"Autumn-Winter",
        water:"Hydratation (%):",
        waterSuggest:"If you don't have great experience, don't change the suggested value.",
        recipeDetails:"Your recipe details",
        rec:"Recipe:",
        pieces:"Pcs:",
        flour:"Flour:",
        wat:"Water:",
        salt:"Salt:",
        sourdough:"Sourdough:",
        oil:"Olive Oil:",
        oil1:"tbsp",
        oil2:"tbsp",
        oil3:"tbsp",
        fatBoy:"Ops, Crumb Snatcher detected!",
        fatBoy1:"I understand your craving for ",
        fatBoy2:"specialist dietitian ",
        fatBoy3:"Dr. Yeasty ",
        fatBoy4:"will immediately receive you!",
        logout : "Back",
        createSourdough:"Create your own sourdough",
        calculatorButton:"Calculator",
        chatNow:"Chat Now",
        close:"Close",
        teachMe:"Help me!",
        help:"Help",
        contactTitle:"Write your request and contact method:",
        contactMessageRecipe:"Hi Marco! I would like to learn more about this recipe :",
        contactMessageCalculator:"Hi Marco! I need help with the calculator.",
        products: {
            Chleb: "Bread",
            Focaccia: "Focaccia",
            Pizza: "Pizza"
        },
        sourSlideTitles: {
            zero: "What is sourdough?",
            one: "The bait",
            two: "Feedings",
            three: "The consistency",
            four: "Final aspects"
        },
        sourdough01:"A bouquet of microorganisms that coexist in symbiosis in a medium\n" +
            "made of water and flour, including yeasts (usually Saccharomyces cerevisiae)\n" +
            "and lactic bacteria (Lactobacillus).",
        sourdough02: "The yeasts, responsible for the leavening of the dough,\n" +
            "assisted by certain enzymes (amylases and proteases),\n" +
            "ferment part of the sugars in the flour.",
        sourdough03: "The bacteria produce acetic and lactic acid,\n" +
            "which give the final product an incredible taste and aroma,\n" +
            "extended shelf life, and beneficial contribution to your gut.",

        sourdough11:"In a jar of about 300 ml, combine 3 tablespoons of whole wheat flour with a bit of boiling water,\n" +
            "and mix until you get a creamy consistency.",
        sourdough12:
            "After 5 minutes, add one teaspoon of plain unsweetened yogurt or kefir and mix well.",
        sourdough13:
            "Cover the jar with gauze or a cloth, and leave it in your kitchen at room temperature\n" +
            "for at least 2 days in summer, up to 4 days in winter.\n" +
            "If mold forms, start over.",
        sourdough21:"Discard the upper half of the jar's contents and add 2 tablespoons of type 00 flour\n" +
            "(soft wheat, spelt, or re-milled semolina, with a protein content not lower than 12%), non-wholemeal,\n" +
            "and enough water to return to the original consistency.",
        sourdough22:
        "Stir well, loosely close the jar with the lid and let it ferment at a minimum of 21°C for 24 hours\n" +
        "(a turned-off oven is the ideal spot).",
        sourdough23:
        "Repeat this process (called 'Feeding') for 4–5 days, each time the starter doubles in volume.",
        sourdough31:"Discard the upper half of the jar's contents and add 3 tablespoons of type 00 flour\n" +
            "(soft wheat, spelt, or re-milled semolina, with a protein content not lower than 12%),\n" +
            "non-wholemeal, a pinch of salt, and 1 tablespoon of water,\n" +
            "so that the starter reaches a firm yet pliable consistency.",
        sourdough32:
            "Mix well, loosely close the jar with the lid, and let it ferment at a minimum of 21°C for 24 hours\n" +
            "(a turned-off oven is the ideal place).\n" +
            "Once it doubles in volume, the starter is ready to use!",
        sourdough41:"Use the sourdough starter only when it has doubled in volume after being fed!",
        sourdough42:
            "When you're preparing a recipe, remember to leave a small portion of starter in the jar,\n" +
            "which you will then feed and store in the fridge — where it can stay for up to 2 days,\n" +
            "waiting for your next baking session!",
        authErrors: {
            'auth/invalid-email': 'Invalid email address. Please check and try again.',
            'auth/user-disabled': 'This account has been disabled. Contact support.',
            'auth/invalid-credential': 'Invalid credentials provided. Check email and password.',
            'auth/email-already-in-use': 'This email is already registered. Try logging in or use password reset.',
            'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/too-many-requests': 'Too many attempts. Please try again later.',
            'auth/invalid-password': 'Invalid password format.',
            'auth/network-request-failed': 'Network error. Check your connection.',
            'empty-fields': 'Please enter email and password.',
        },
    },
    IT: {
        title: "PH4.1",
        sectionTitles: {
            calculator: "Calcolatore",
            sourdough: "Crea il tuo lievito madre",
            settings: "Impostazioni"
        },
        subTitle:"La prima app per i tuoi prodotti con lievito madre",
        productLabel: "Cosa vuoi fare oggi?",
        goBack:"Indietro",
        chooseOption: "Scegli",
        bread: "Pane",
        pizza: "Pizza",
        tray:"Forma della teglia:",
        tray5cm:"Scegli una teglia alta almeno 5cm!",
        breadWeight: "Peso della pagnotta (g):",
        squareShape:"Rettangolare",
        roundShape:"Tonda",
        sets:"Impostazioni",
        focaccia: "Focaccia",
        length:"Lunghezza (cm):",
        width:"larghezza (cm):",
        calculate: "Calcola",
        reset: "Reset",
        diameter:"Diametro (cm):",
        pcs:"Quanti pezzi?",
        period:"Stagione:",
        periodSuggest:"In estate utilizzi meno lievito madre rispetto all'inverno.",
        summer:"Primavera-Estate",
        winter:"Autunno-Inverno",
        water:"Idratazione (%):",
        waterSuggest:"Se non hai molta esperienza, lascia il valore consigliato.",
        recipeDetails:"Dettagli della ricetta",
        rec:"Ricetta:",
        pieces:"Pz:",
        flour:"Farina:",
        wat:"Acqua:",
        salt:"Sale:",
        sourdough:"L.Madre:",
        oil:"Olio:",
        oil1:"cucchiaio",
        oil2:"cucchiai",
        oil3:"cucchiai",
        fatBoy:"Attenzione, rilevato un Ghiottone!",
        fatBoy1:"Posso capire la tua brama di ",
        fatBoy2:"lo specialista dietologo ",
        fatBoy3:"Dr. Saccaro ",
        fatBoy4:"ti riceverà immediatamente!",
        logout : "Indietro",
        createSourdough:"Crea il tuo lievito madre",
        calculatorButton:"Calcolatore",
        chatNow:"Contattami ora",
        close:"Chiudi",
        teachMe:"Aiutami!",
        help:"Aiuto",
        contactTitle:"Scrivi la tua richiesta ed il metodo di contatto:",
        contactMessageRecipe:"Ciao Marco! Vorrei migliorare il processo per fare questa ricetta : ",
        contactMessageCalculator:"Ciao Marco! Ho bisogno di aiuto con il calcolatore.",
        products: {
            Chleb: "Pane",
            Focaccia: "Focaccia",
            Pizza: "Pizza"
        },
        sourSlideTitles : {
            zero :"Cosa è la pasta madre?",
            one : "L'esca",
            two : "I rinfreschi",
            three : "La consistenza",
            four : "Ultime considerazioni"
        },
        sourdough01:"Un bouquet di numerosi microrganismi che\n" +
            "coesistono in simbiosi in un mezzo\n" +
            "costituito da acqua e farina, tra cui lieviti (di solito Saccharomyces Cerevisiae) e batteri\n" +
            "lattici (Lactobacillus).",
        sourdough02: "I lieviti, responsabili della lievitazione dell'impasto, coadiuvati da alcuni enzimi (amilasi e proteasi), fermentano una parte di zuccheri della farina.",
        sourdough03: "I batteri producono acido acetico e lattico, che conferiscono al prodotto finale gusto ed aromi incredibili,\n" +
            "elevata shelf-life ed un moderato contributo benefico al tuo intestino.",

        sourdough11:"In un barattolo da 300ml circa, unisci 3 cucchiai di farina integrale con un pò di acqua" +
            " bollente, e mischia fino ad ottenere una consistenza cremosa.",
        sourdough12:
            "Dopo 5 minuti, aggiungi un cucchiaino di yogurt senza zuccheri o kefir e mischia tutto.",
        sourdough13:
            "Copri il barattolo con una garza, o con un panno, e lascialo in cucina a temperatura ambiente\n" +
            "per un minimo di 2 giorni d'estate, fino ad un massimo di 4 giorni d'inverno.\n" +
            "Qualora dovesse formarsi della muffa, ricomincia daccapo.",
        sourdough21:"Butta la metà superiore del contenuto del barattolo, e aggiungi 2 cucchiai di farina 00 (" +
            "grano tenero, farro, semola rimacinata, con proteine non inferiori al 12%) non integrale, e l'acqua" +
            " necessaria a tornare alla consistenza iniziale.",
        sourdough22:
        "Mischia bene, socchiudi il barattolo con il coperchio e lascia fermentare almeno a 21°C per" +
        " 24h (il forno" +
        " spento è il posto ideale).",
        sourdough23:
        "Ripeti il processo (cosiddetto 'rinfresco') per 4-5 giorni, ogni volta che" +
        " il" +
        " volume del lievito" +
        " raddoppia.",
        sourdough31:"Butta la metà superiore del contenuto del barattolo, e aggiungi 3 cucchiai di farina 00 (" +
            "grano tenero, farro, semola rimacinata, con proteine non inferiori al 12%) non integrale, un pizzico di" +
            "sale, ed 1 cucchiaio di acqua, affinchè il lievito sia di consistenza solida ma malleabile.",
        sourdough32:
            "Mischia bene, socchiudi il barattolo con il coperchio e lascia fermentare almeno a 21°C per 24h (il" +
            " forno" +
            " spento è il posto ideale). Quando raddoppierà di volume, il lievito sarà pronto da essere usato!",
        sourdough41:"Usa il lievito madre solo quando il suo volume è raddoppiato dopo averlo rinfrescato!",
        sourdough42:
            "Quando prepari un prodotto, ricorda di lasciare una" +
            " piccola parte di lievito madre nel barattolo, che andrai a rinfrescare e conservare in frigo, dove " +
            "potrà stare per 2 giorni, in attesa della prossima panificazione!",
        authErrors: {
            'auth/invalid-email': 'Indirizzo e-mail non valido. Controlla e riprova.',
            'auth/user-disabled': "Account disabilitato. Contatta l'assistenza.",
            'auth/invalid-credential': 'Credenziali non valide. Controlla email e password.',
            'auth/email-already-in-use': 'Questa email è già registrata. Prova a effettuare il login o il reset della password.',
            'auth/weak-password': "La password è troppo debole. Usa almeno 6 caratteri.",
            'auth/user-not-found': "Nessun account trovato con questa email.",
            'auth/wrong-password': 'Password errata. Riprova.',
            'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
            'auth/invalid-password': 'Formato password non valido.',
            'auth/network-request-failed': "Errore di rete. Controlla la connessione.",
            'empty-fields': 'Per favore inserisci email e password.',
        },
    }
};

export default translations;
