var lockTime = {
    time: "",
    category: ""
};

var matterRace = {
    previousRace: {
        round: '',
        date: '',
        name: '',
        race: ''
    },
    nextRace: {
        round: '',
        date: '',
        name: '',
        race: ''
    }
}

const races = [
    {
      season: '2023',
      round: '1',
      url: 'https://en.wikipedia.org/wiki/2023_Bahrain_Grand_Prix',
      raceName: 'Bahrain Grand Prix',
      Circuit: {
        circuitId: 'bahrain',
        url: 'http://en.wikipedia.org/wiki/Bahrain_International_Circuit',
        circuitName: 'Bahrain International Circuit',
        Location: [Object]
      },
      date: '2023-03-05',
      time: '15:00:00Z',
      FirstPractice: { date: '2023-03-03', time: '11:30:00Z' },
      SecondPractice: { date: '2023-03-03', time: '15:00:00Z' },
      ThirdPractice: { date: '2023-03-04', time: '11:30:00Z' },
      Qualifying: { date: '2023-03-04', time: '15:00:00Z' }
    },
    {
      season: '2023',
      round: '2',
      url: 'https://en.wikipedia.org/wiki/2023_Saudi_Arabian_Grand_Prix',
      raceName: 'Saudi Arabian Grand Prix',
      Circuit: {
        circuitId: 'jeddah',
        url: 'http://en.wikipedia.org/wiki/Jeddah_Street_Circuit',
        circuitName: 'Jeddah Corniche Circuit',
        Location: [Object]
      },
      date: '2023-03-19',
      time: '17:00:00Z',
      FirstPractice: { date: '2023-03-17', time: '13:30:00Z' },
      SecondPractice: { date: '2023-03-17', time: '17:00:00Z' },
      ThirdPractice: { date: '2023-03-18', time: '13:30:00Z' },
      Qualifying: { date: '2023-03-18', time: '17:00:00Z' }
    },
    {
      season: '2023',
      round: '3',
      url: 'https://en.wikipedia.org/wiki/2023_Australian_Grand_Prix',
      raceName: 'Australian Grand Prix',
      Circuit: {
        circuitId: 'albert_park',
        url: 'http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit',
        circuitName: 'Albert Park Grand Prix Circuit',
        Location: [Object]
      },
      date: '2023-04-02',
      time: '05:00:00Z',
      FirstPractice: { date: '2023-03-31', time: '01:30:00Z' },
      SecondPractice: { date: '2023-03-31', time: '05:00:00Z' },
      ThirdPractice: { date: '2023-04-01', time: '01:30:00Z' },
      Qualifying: { date: '2023-04-01', time: '05:00:00Z' }
    },
    {
      season: '2023',
      round: '4',
      url: 'https://en.wikipedia.org/wiki/2023_Azerbaijan_Grand_Prix',
      raceName: 'Azerbaijan Grand Prix',
      Circuit: {
        circuitId: 'baku',
        url: 'http://en.wikipedia.org/wiki/Baku_City_Circuit',
        circuitName: 'Baku City Circuit',
        Location: [Object]
      },
      date: '2023-04-30',
      time: '11:00:00Z',
      FirstPractice: { date: '2023-04-28', time: '09:30:00Z' },
      Qualifying: { date: '2023-04-28', time: '13:00:00Z' },
      SecondPractice: { date: '2023-04-29', time: '09:30:00Z' },
      Sprint: { date: '2023-04-29', time: '13:30:00Z' }
    },
    {
      season: '2023',
      round: '5',
      url: 'https://en.wikipedia.org/wiki/2023_Miami_Grand_Prix',
      raceName: 'Miami Grand Prix',
      Circuit: {
        circuitId: 'miami',
        url: 'http://en.wikipedia.org/wiki/Miami_International_Autodrome',
        circuitName: 'Miami International Autodrome',
        Location: [Object]
      },
      date: '2023-05-07',
      time: '19:30:00Z',
      FirstPractice: { date: '2023-05-05', time: '17:30:00Z' },
      SecondPractice: { date: '2023-05-05', time: '21:00:00Z' },
      ThirdPractice: { date: '2023-05-06', time: '16:30:00Z' },
      Qualifying: { date: '2023-05-06', time: '20:00:00Z' }
    },
    {
      season: '2023',
      round: '6',
      url: 'https://en.wikipedia.org/wiki/2023_Emilia_Romagna_Grand_Prix',
      raceName: 'Emilia Romagna Grand Prix',
      Circuit: {
        circuitId: 'imola',
        url: 'http://en.wikipedia.org/wiki/Autodromo_Enzo_e_Dino_Ferrari',
        circuitName: 'Autodromo Enzo e Dino Ferrari',
        Location: [Object]
      },
      date: '2023-05-21',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-05-19', time: '11:30:00Z' },
      SecondPractice: { date: '2023-05-19', time: '15:00:00Z' },
      ThirdPractice: { date: '2023-05-20', time: '10:30:00Z' },
      Qualifying: { date: '2023-05-20', time: '14:00:00Z' }
    },
    {
      season: '2023',
      round: '7',
      url: 'https://en.wikipedia.org/wiki/2023_Monaco_Grand_Prix',
      raceName: 'Monaco Grand Prix',
      Circuit: {
        circuitId: 'monaco',
        url: 'http://en.wikipedia.org/wiki/Circuit_de_Monaco',
        circuitName: 'Circuit de Monaco',
        Location: [Object]
      },
      date: '2023-05-28',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-05-26', time: '11:30:00Z' },
      SecondPractice: { date: '2023-05-26', time: '15:00:00Z' },
      ThirdPractice: { date: '2023-05-27', time: '10:30:00Z' },
      Qualifying: { date: '2023-05-27', time: '14:00:00Z' }
    },
    {
      season: '2023',
      round: '8',
      url: 'https://en.wikipedia.org/wiki/2023_Spanish_Grand_Prix',
      raceName: 'Spanish Grand Prix',
      Circuit: {
        circuitId: 'catalunya',
        url: 'http://en.wikipedia.org/wiki/Circuit_de_Barcelona-Catalunya',
        circuitName: 'Circuit de Barcelona-Catalunya',
        Location: [Object]
      },
      date: '2023-06-04',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-06-02', time: '11:30:00Z' },
      SecondPractice: { date: '2023-06-02', time: '15:00:00Z' },
      ThirdPractice: { date: '2023-06-03', time: '10:30:00Z' },
      Qualifying: { date: '2023-06-03', time: '14:00:00Z' }
    },
    {
      season: '2023',
      round: '9',
      url: 'https://en.wikipedia.org/wiki/2023_Canadian_Grand_Prix',
      raceName: 'Canadian Grand Prix',
      Circuit: {
        circuitId: 'villeneuve',
        url: 'http://en.wikipedia.org/wiki/Circuit_Gilles_Villeneuve',
        circuitName: 'Circuit Gilles Villeneuve',
        Location: [Object]
      },
      date: '2023-06-18',
      time: '18:00:00Z',
      FirstPractice: { date: '2023-06-16', time: '17:30:00Z' },
      SecondPractice: { date: '2023-06-16', time: '21:00:00Z' },
      ThirdPractice: { date: '2023-06-17', time: '16:30:00Z' },
      Qualifying: { date: '2023-06-17', time: '20:00:00Z' }
    },
    {
      season: '2023',
      round: '10',
      url: 'https://en.wikipedia.org/wiki/2023_Austrian_Grand_Prix',
      raceName: 'Austrian Grand Prix',
      Circuit: {
        circuitId: 'red_bull_ring',
        url: 'http://en.wikipedia.org/wiki/Red_Bull_Ring',
        circuitName: 'Red Bull Ring',
        Location: [Object]
      },
      date: '2023-07-02',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-06-30', time: '11:30:00Z' },
      Qualifying: { date: '2023-06-30', time: '15:00:00Z' },
      SecondPractice: { date: '2023-07-01', time: '10:30:00Z' },
      Sprint: { date: '2023-07-01', time: '14:30:00Z' }
    },
    {
      season: '2023',
      round: '11',
      url: 'https://en.wikipedia.org/wiki/2023_British_Grand_Prix',
      raceName: 'British Grand Prix',
      Circuit: {
        circuitId: 'silverstone',
        url: 'http://en.wikipedia.org/wiki/Silverstone_Circuit',
        circuitName: 'Silverstone Circuit',
        Location: [Object]
      },
      date: '2023-07-09',
      time: '14:00:00Z',
      FirstPractice: { date: '2023-07-07', time: '11:30:00Z' },
      SecondPractice: { date: '2023-07-07', time: '15:00:00Z' },
      ThirdPractice: { date: '2023-07-08', time: '10:30:00Z' },
      Qualifying: { date: '2023-07-08', time: '14:00:00Z' }
    },
    {
      season: '2023',
      round: '12',
      url: 'https://en.wikipedia.org/wiki/2023_Hungarian_Grand_Prix',
      raceName: 'Hungarian Grand Prix',
      Circuit: {
        circuitId: 'hungaroring',
        url: 'http://en.wikipedia.org/wiki/Hungaroring',
        circuitName: 'Hungaroring',
        Location: [Object]
      },
      date: '2023-07-23',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-07-21', time: '11:30:00Z' },
      SecondPractice: { date: '2023-07-21', time: '15:00:00Z' },
      ThirdPractice: { date: '2023-07-22', time: '10:30:00Z' },
      Qualifying: { date: '2023-07-22', time: '14:00:00Z' }
    },
    {
      season: '2023',
      round: '13',
      url: 'https://en.wikipedia.org/wiki/2023_Belgian_Grand_Prix',
      raceName: 'Belgian Grand Prix',
      Circuit: {
        circuitId: 'spa',
        url: 'http://en.wikipedia.org/wiki/Circuit_de_Spa-Francorchamps',
        circuitName: 'Circuit de Spa-Francorchamps',
        Location: [Object]
      },
      date: '2023-07-30',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-07-28', time: '11:30:00Z' },
      Qualifying: { date: '2023-07-28', time: '15:00:00Z' },
      SecondPractice: { date: '2023-07-29', time: '10:30:00Z' },
      Sprint: { date: '2023-07-29', time: '14:30:00Z' }
    },
    {
      season: '2023',
      round: '14',
      url: 'https://en.wikipedia.org/wiki/2023_Dutch_Grand_Prix',
      raceName: 'Dutch Grand Prix',
      Circuit: {
        circuitId: 'zandvoort',
        url: 'http://en.wikipedia.org/wiki/Circuit_Zandvoort',
        circuitName: 'Circuit Park Zandvoort',
        Location: [Object]
      },
      date: '2023-08-27',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-08-25', time: '10:30:00Z' },
      SecondPractice: { date: '2023-08-25', time: '14:00:00Z' },
      ThirdPractice: { date: '2023-08-26', time: '09:30:00Z' },
      Qualifying: { date: '2023-08-26', time: '13:00:00Z' }
    },
    {
      season: '2023',
      round: '15',
      url: 'https://en.wikipedia.org/wiki/2023_Italian_Grand_Prix',
      raceName: 'Italian Grand Prix',
      Circuit: {
        circuitId: 'monza',
        url: 'http://en.wikipedia.org/wiki/Autodromo_Nazionale_Monza',
        circuitName: 'Autodromo Nazionale di Monza',
        Location: [Object]
      },
      date: '2023-09-03',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-09-01', time: '11:30:00Z' },
      SecondPractice: { date: '2023-09-01', time: '15:00:00Z' },
      ThirdPractice: { date: '2023-09-02', time: '10:30:00Z' },
      Qualifying: { date: '2023-09-02', time: '14:00:00Z' }
    },
    {
      season: '2023',
      round: '16',
      url: 'https://en.wikipedia.org/wiki/2023_Singapore_Grand_Prix',
      raceName: 'Singapore Grand Prix',
      Circuit: {
        circuitId: 'marina_bay',
        url: 'http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit',
        circuitName: 'Marina Bay Street Circuit',
        Location: [Object]
      },
      date: '2023-09-17',
      time: '12:00:00Z',
      FirstPractice: { date: '2023-09-15', time: '09:30:00Z' },
      SecondPractice: { date: '2023-09-15', time: '13:00:00Z' },
      ThirdPractice: { date: '2023-09-16', time: '09:30:00Z' },
      Qualifying: { date: '2023-09-16', time: '13:00:00Z' }
    },
    {
      season: '2023',
      round: '17',
      url: 'https://en.wikipedia.org/wiki/2023_Japanese_Grand_Prix',
      raceName: 'Japanese Grand Prix',
      Circuit: {
        circuitId: 'suzuka',
        url: 'http://en.wikipedia.org/wiki/Suzuka_Circuit',
        circuitName: 'Suzuka Circuit',
        Location: [Object]
      },
      date: '2023-09-24',
      time: '05:00:00Z',
      FirstPractice: { date: '2023-09-22', time: '02:30:00Z' },
      SecondPractice: { date: '2023-09-22', time: '06:00:00Z' },
      ThirdPractice: { date: '2023-09-23', time: '02:30:00Z' },
      Qualifying: { date: '2023-09-23', time: '06:00:00Z' }
    },
    {
      season: '2023',
      round: '18',
      url: 'https://en.wikipedia.org/wiki/2023_Qatar_Grand_Prix',
      raceName: 'Qatar Grand Prix',
      Circuit: {
        circuitId: 'losail',
        url: 'http://en.wikipedia.org/wiki/Losail_International_Circuit',
        circuitName: 'Losail International Circuit',
        Location: [Object]
      },
      date: '2023-10-08',
      time: '14:00:00Z',
      FirstPractice: { date: '2023-10-06', time: '10:30:00Z' },
      Qualifying: { date: '2023-10-06', time: '14:00:00Z' },
      SecondPractice: { date: '2023-10-07', time: '10:30:00Z' },
      Sprint: { date: '2023-10-07', time: '14:30:00Z' }
    },
    {
      season: '2023',
      round: '19',
      url: 'https://en.wikipedia.org/wiki/2023_United_States_Grand_Prix',
      raceName: 'United States Grand Prix',
      Circuit: {
        circuitId: 'americas',
        url: 'http://en.wikipedia.org/wiki/Circuit_of_the_Americas',
        circuitName: 'Circuit of the Americas',
        Location: [Object]
      },
      date: '2023-10-22',
      time: '19:00:00Z',
      FirstPractice: { date: '2023-10-20', time: '17:30:00Z' },
      Qualifying: { date: '2023-10-20', time: '21:00:00Z' },
      SecondPractice: { date: '2023-10-21', time: '18:00:00Z' },
      Sprint: { date: '2023-10-21', time: '22:00:00Z' }
    },
    {
      season: '2023',
      round: '20',
      url: 'https://en.wikipedia.org/wiki/2023_Mexico_City_Grand_Prix',
      raceName: 'Mexico City Grand Prix',
      Circuit: {
        circuitId: 'rodriguez',
        url: 'http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez',
        circuitName: 'Autódromo Hermanos Rodríguez',
        Location: [Object]
      },
      date: '2023-10-29',
      time: '20:00:00Z',
      FirstPractice: { date: '2023-10-27', time: '18:30:00Z' },
      SecondPractice: { date: '2023-10-27', time: '22:00:00Z' },
      ThirdPractice: { date: '2023-10-28', time: '17:30:00Z' },
      Qualifying: { date: '2023-10-28', time: '21:00:00Z' }
    },
    {
      season: '2023',
      round: '21',
      url: 'https://en.wikipedia.org/wiki/2023_S%C3%A3o_Paulo_Grand_Prix',
      raceName: 'São Paulo Grand Prix',
      Circuit: {
        circuitId: 'interlagos',
        url: 'http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace',
        circuitName: 'Autódromo José Carlos Pace',
        Location: [Object]
      },
      date: '2023-11-05',
      time: '17:00:00Z',
      FirstPractice: { date: '2023-11-03', time: '14:30:00Z' },
      Qualifying: { date: '2023-11-03', time: '18:00:00Z' },
      SecondPractice: { date: '2023-11-04', time: '14:30:00Z' },
      Sprint: { date: '2023-11-04', time: '18:30:00Z' }
    },
    {
      season: '2023',
      round: '22',
      url: 'https://en.wikipedia.org/wiki/2023_Las_Vegas_Grand_Prix',
      raceName: 'Las Vegas Grand Prix',
      Circuit: {
        circuitId: 'vegas',
        url: 'https://en.wikipedia.org/wiki/Las_Vegas_Grand_Prix#Circuit',
        circuitName: 'Las Vegas Strip Street Circuit',
        Location: [Object]
      },
      date: '2023-11-19',
      time: '06:00:00Z',
      FirstPractice: { date: '2023-11-17', time: '04:30:00Z' },
      SecondPractice: { date: '2023-11-17', time: '08:00:00Z' },
      ThirdPractice: { date: '2023-11-18', time: '04:30:00Z' },
      Qualifying: { date: '2023-11-18', time: '08:00:00Z' }
    },
    {
      season: '2023',
      round: '23',
      url: 'https://en.wikipedia.org/wiki/2023_Abu_Dhabi_Grand_Prix',
      raceName: 'Abu Dhabi Grand Prix',
      Circuit: {
        circuitId: 'yas_marina',
        url: 'http://en.wikipedia.org/wiki/Yas_Marina_Circuit',
        circuitName: 'Yas Marina Circuit',
        Location: [Object]
      },
      date: '2023-11-26',
      time: '13:00:00Z',
      FirstPractice: { date: '2023-11-24', time: '09:30:00Z' },
      SecondPractice: { date: '2023-11-24', time: '13:00:00Z' },
      ThirdPractice: { date: '2023-11-25', time: '10:30:00Z' },
      Qualifying: { date: '2023-11-25', time: '14:00:00Z' }
    }
]


exports.lockTime = lockTime;
exports.matterRace = matterRace;
exports.races = races;