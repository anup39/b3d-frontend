import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Select } from "@react-three/drei";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      fallbackLng: "en",
      lng: "en",
      debug: true,
      en: {
        translation: {
          Login: "Log in",
          Username: "Username",
          Password: "Password",
          Remember: "Remember",
          Me: "me",
          Forgot: "Forgot",
          Signup: "Sign up",
          Client: "Client",
          Clients: "Clients",
          Classification: "Classification",
          Inspection: "Inspection",
          Type: "Type",
          About: "About",
          Contact: "Contact",
          Role: "Role",
          Create: "Create",
          Open: "Open",
          Profile: "Profile",
          Dashboard: "Dashboard",
          Account: "Account",
          Logout: "Logout",
          View: "View",
          Manage: "Manage",
          Class: "Class",
          User: "User",
          Users: "Users",
          Total: "Total",
          Property: "Property",
          Properties: "Properties",
          Map: "Map",
          Maps: "Maps",
          Firstname: "Firstname",
          Lastname: "Lastname",
          Email: "Email",
          Description: "Description",
          Close: "Close",
          ThreeDurl: "3D url",
          Indoor: "Indoor",
          Indoors: "Indoors",
          Name: "Name",
          File: "File",
          Files: "Files",
          Projection: "Projection",
          Size: "Size",
          Task: "Task",
          Id: "Id",
          Status: "Status",
          Supported: "Supported",
          Projections: "Projections",
          For: "for",
          Other: "other",
          Acceptable: "Acceptable",
          Upload: "Upload",
          Address: "Address",
          Standard: "Standard",
          Sub: "Sub",
          Category: "category",
          Categories: "Categories",
          Of: "of",
          Geometry: "geometry",
          Fill: "Fill",
          Color: "Color",
          Opacity: "Opacity",
          Stroke: "Stroke",
          Width: "Width",
          Edit: "Edit",
          Edited: "Edited",
          Select: "Select",
          Selected: "Selected",
          Are: "Are",
          You: "You",
          Sure: "Sure",
          To: "To",
          Delete: "Delete",
          This: "This",
          Yes: "Yes",
          Group: "Group",
          Roles: "Roles",
          Assign: "Assign",
          Choice: "Choice",
          Choices: "Choices",
          Save: "Save",
          Date: "Date",
          Joined: "Joined",
          Url: "Url",
          No: "No",
          Yet: "yet",
          Successfully: "Successfully",
          Failed: "Failed",
          Loading: "Loading",
          Search: "Search",
          Show: "Show",
          All: "All",
          Measurements: "Measurements",
          Clear: "Clear",
          Measurings: "Measurings",
          Polygon: "Polygon",
          Report: "Report",
          List: "List",
          Import: "Import",
          Table: "Table",
          Piechart: "Piechart",
          Draw: "Draw",
          Zoom: "Zoom",
          Layer: "Layer",
          Represents: "Represents",
          Area: "Area",
          In: "In",
          Square: "Square",
          Meters: "Meters",
          Symbol: "Symbol",
          Length: "Length",
          Count: "Count",
          Available: "Available",
          Modify: "Modify",
          The: "The",
          Matched: "Matched",
          Note: "Note",
          Here: "Here",
          We: "We",
          Use: "Use",
          AI: "AI",
          Model: "Model",
          Clean: "Clean",
          Data: "Data",
          Detect: "Detect",
          Measure: "Measure",
          Cancel: "Cancel",
          Features: "Features",
          Paper: "Paper",
          Print: "Print",
          Either: "Either",
          None: "None",
          Checked: "Checked",
          Or: "Or",
          Add: "Add",
          Pick: "Pick",
          A: "A",
          Press: "Press",
          Enter: "Enter",
          Drawing: "Drawing",
          And: "And",
          Drawn: "Drawn",
          Welcome: "Welcome",
        },
      },
      da: {
        Login: "Log ind",
        Username: "Brugernavn",
        Password: "Adgangskode",
        Remember: "Husk",
        Me: "mig",
        Forgot: "Glemt",
        Signup: "Tilmeld",
        Client: "Klient",
        Clients: "Klienter",
        Classification: "Klassifikation",
        Inspection: "Inspektion",
        Type: "Type",
        About: "Om",
        Contact: "Kontakt",
        Role: "Rolle",
        Create: "Opret",
        Open: "Åben",
        Profile: "Profil",
        Dashboard: "Instrumentbræt",
        Account: "Konto",
        Logout: "Log ud",
        View: "Se",
        Manage: "Administrer",
        Class: "Klasse",
        User: "Bruger",
        Users: "Brugere",
        Total: "Total",
        Property: "Ejendom",
        Properties: "Ejendomme",
        Map: "Kort",
        Maps: "Kort",
        Firstname: "Fornavn",
        Lastname: "Efternavn",
        Email: "Email",
        Description: "Beskrivelse",
        Close: "Luk",
        ThreeDurl: "3D url",
        Indoor: "Indendørs",
        Indoors: "Indendørs",
        Name: "Navn",
        File: "Fil",
        Files: "Filer",
        Projection: "Projektion",
        Size: "Størrelse",
        Task: "Opgave",
        Id: "Id",
        Status: "Status",
        Supported: "Understøttet",
        Projections: "Projektioner",
        For: "for",
        Other: "andre",
        Acceptable: "Acceptabel",
        Upload: "Upload",
        Address: "Adresse",
        Standard: "Standard",
        Sub: "Under",
        Category: "kategori",
        Categories: "Kategorier",
        Of: "af",
        Geometry: "geometri",
        Fill: "Fyld",
        Color: "Farve",
        Opacity: "Gennemsigtighed",
        Stroke: "Slag",
        Width: "Bredde",
        Edit: "Rediger",
        Edited: "Rediger",
        Select: "Vælg",
        Selected: "Valgt",
        Are: "Er",
        You: "du",
        Sure: "Sikker",
        To: "Til",
        Delete: "Slet",
        This: "Dette",
        Yes: "Ja",
        Group: "Gruppe",
        Roles: "Roller",
        Assign: "Tildel",
        Choice: "Valg",
        Choices: "Valg",
        Save: "Gem",
        Date: "Dato",
        Joined: "Tilmeldt",
        Url: "Url",
        No: "Ingen",
        Yet: "endnu",
        Successfully: "Succesfuldt",
        Failed: "Mislykkedes",
        Loading: "Indlæser",
        Search: "Søg",
        Show: "Vis",
        All: "Alle",
        Measurements: "Målinger",
        Clear: "Ryd",
        Measurings: "Målinger",
        Polygon: "Polygon",
        Report: "Rapport",
        List: "Liste",
        Import: "Importer",
        Table: "Tabel",
        Piechart: "Kagechart",
        Draw: "Tegn",
        Zoom: "Zoom",
        Layer: "Lag",
        Represents: "Repræsenterer",
        Area: "Område",
        In: "I",
        Square: "Firkant",
        Meters: "Meter",
        Symbol: "Symbol",
        Length: "Længde",
        Count: "Tæl",
        Available: "Tilgængelig",
        Modify: "Ændre",
        The: "Den",
        Matched: "Matchet",
        Note: "Bemærk",
        Here: "Her",
        We: "Vi",
        Use: "Brug",
        AI: "AI",
        Model: "Model",
        Clean: "Ryd",
        Data: "Data",
        Detect: "Detekter",
        Measure: "Mål",
        Cancel: "Annuller",
        Features: "Funktioner",
        Paper: "Papir",
        Print: "Print",
        Either: "Enten",
        None: "Ingen",
        Checked: "Kontrolleret",
        Or: "Eller",
        Add: "Tilføj",
        Pick: "Vælg",
        A: "En",
        Press: "Tryk",
        Enter: "Indtast",
        Drawing: "Tegning",
        And: "Og",
        Drawn: "Tegnet",
        Welcome: "Velkommen",
      },
    },

    // interpolation: {
    //   escapeValue: false,
    // },
  });
