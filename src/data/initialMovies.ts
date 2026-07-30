import { Movie } from '../types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'movie-1',
    title: 'Cyber Runner 2099',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    description: 'In a neon-drenched futuristic metropolis, a rogue hacker uncovers a sinister AI conspiracy that threatens humanity. Armed with high-tech modifications, she races against time to leak the truth before corporate mercenaries hunt her down.',
    genres: ['Action', 'Sci-Fi', 'Hollywood'],
    language: 'English',
    country: 'USA',
    releaseYear: 2024,
    runtime: '2h 18m',
    imdbRating: 8.7,
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Ryan Gosling', character: 'K-9' },
      { name: 'Ana de Armas', character: 'Joi' },
      { name: 'Sylvia Hoeks', character: 'Luv' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/gCcx85zbxz4',
    bunnyVideoId: 'bunny-cyber-2099',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    downloadUrls: {
      quality480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      quality4k: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    isFeatured: true,
    isTrending: true,
    isLatest: true,
    isPopular: true,
    viewsCount: 142500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'movie-2',
    title: 'Shadows in the Dark',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    description: 'A haunted mansion located deep inside an isolated pine forest harbors a terrifying ancient entity. A team of paranormal investigators enter to solve its century-old mysteries, only to discover they are not alone.',
    genres: ['Horror', 'Thriller', 'Hollywood'],
    language: 'English',
    country: 'USA',
    releaseYear: 2023,
    runtime: '1h 45m',
    imdbRating: 7.9,
    director: 'James Wan',
    cast: [
      { name: 'Patrick Wilson', character: 'Ed Warren' },
      { name: 'Vera Farmiga', character: 'Lorraine Warren' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/hEJnMQG56iA',
    bunnyVideoId: 'bunny-shadows-dark',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    downloadUrls: {
      quality480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    },
    isFeatured: false,
    isTrending: true,
    isLatest: true,
    isPopular: false,
    viewsCount: 98200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'movie-3',
    title: 'Sultan: The Royal Dynasty',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    description: 'An epic historic saga detailing the rise of a visionary warrior emperor who united kingdoms across ancient South Asia to defend against invader empires.',
    genres: ['Action', 'Drama', 'Indian', 'Bollywood'],
    language: 'Hindi',
    country: 'India',
    releaseYear: 2024,
    runtime: '2h 52m',
    imdbRating: 8.9,
    director: 'S.S. Rajamouli',
    cast: [
      { name: 'Prabhas', character: 'Sultan' },
      { name: 'Rana Daggubati', character: 'Bhallala' },
      { name: 'Anushka Shetty', character: 'Devasena' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/sOEg_YNvfG4',
    bunnyVideoId: 'bunny-sultan-dynasty',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    downloadUrls: {
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    isFeatured: true,
    isTrending: true,
    isLatest: true,
    isPopular: true,
    viewsCount: 320000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'movie-4',
    title: 'Ishq-e-Laila',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&auto=format&fit=crop&q=80',
    description: 'A romantic Pakistani blockbuster exploring love, traditional family expectations, and musical destiny in the historic streets of Lahore.',
    genres: ['Romance', 'Drama', 'Pakistani'],
    language: 'Urdu',
    country: 'Pakistan',
    releaseYear: 2023,
    runtime: '2h 10m',
    imdbRating: 8.4,
    director: 'Nabeel Qureshi',
    cast: [
      { name: 'Fawad Khan', character: 'Zaroon' },
      { name: 'Mahira Khan', character: 'Khirad' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Q0CbN8sfihY',
    bunnyVideoId: 'bunny-ishq-laila',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    downloadUrls: {
      quality480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    isFeatured: false,
    isTrending: true,
    isLatest: false,
    isPopular: true,
    viewsCount: 210000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'movie-5',
    title: 'The Great Laugh Chaos',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
    description: 'When three quirky roomates inadvertently steal a prized diamond from a comical mob boss, hilarity ensues across a wild weekend getaway.',
    genres: ['Comedy', 'Hollywood'],
    language: 'English',
    country: 'USA',
    releaseYear: 2024,
    runtime: '1h 38m',
    imdbRating: 7.6,
    director: 'Todd Phillips',
    cast: [
      { name: 'Bradley Cooper', character: 'Phil' },
      { name: 'Zach Galifianakis', character: 'Alan' },
      { name: 'Ed Helms', character: 'Stu' }
    ],
    bunnyVideoId: 'bunny-laugh-chaos',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    downloadUrls: {
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    isFeatured: false,
    isTrending: false,
    isLatest: true,
    isPopular: true,
    viewsCount: 88400,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'movie-6',
    title: 'Dragon Realm: Awakening',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    description: 'A young blacksmith discovers he holds the ancient spirit bond of the Last Fire Dragon. Together they set off across mystical realms to defeat the Dark Sorcerer.',
    genres: ['Animation', 'Action', 'Fantasy'],
    language: 'English',
    country: 'USA',
    releaseYear: 2024,
    runtime: '1h 50m',
    imdbRating: 8.8,
    director: 'Hayao Miyazaki',
    cast: [
      { name: 'Shameik Moore', character: 'Miles' },
      { name: 'Hailee Steinfeld', character: 'Gwen' }
    ],
    bunnyVideoId: 'bunny-dragon-realm',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    downloadUrls: {
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    },
    isFeatured: true,
    isTrending: true,
    isLatest: true,
    isPopular: true,
    viewsCount: 195000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'show-1',
    title: 'The Sovereign Gambit',
    type: 'tvshow',
    posterUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
    description: 'A gripping political thriller following espionage, chess grandmasters, and intelligence operatives in Cold War Europe.',
    genres: ['Drama', 'Thriller', 'Hollywood'],
    language: 'English',
    country: 'UK',
    releaseYear: 2023,
    runtime: '8 Episodes',
    imdbRating: 9.1,
    director: 'Scott Frank',
    cast: [
      { name: 'Anya Taylor-Joy', character: 'Beth' },
      { name: 'Bill Camp', character: 'Mr. Shaibel' }
    ],
    bunnyVideoId: 'bunny-sovereign-gambit',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    downloadUrls: {
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    },
    seasonsCount: 2,
    episodes: [
      {
        id: 'ep-1-1',
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'Opening Pawn Move',
        description: 'Beth discovers chess in the basement of her orphanage.',
        runtime: '58m',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
      },
      {
        id: 'ep-1-2',
        seasonNumber: 1,
        episodeNumber: 2,
        title: 'Exchanges',
        description: 'Adoption opens a new world of state tournaments and intense competition.',
        runtime: '54m',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
      }
    ],
    isFeatured: true,
    isTrending: true,
    isLatest: false,
    isPopular: true,
    viewsCount: 450000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'movie-7',
    title: 'Pathaan: Resistance',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    description: 'An exiled RAW agent must stop a ruthless mercenary syndicate from launching a bio-weapon attack across major global capitals.',
    genres: ['Action', 'Indian', 'Bollywood'],
    language: 'Hindi',
    country: 'India',
    releaseYear: 2023,
    runtime: '2h 26m',
    imdbRating: 8.1,
    director: 'Siddharth Anand',
    cast: [
      { name: 'Shah Rukh Khan', character: 'Pathaan' },
      { name: 'Deepika Padukone', character: 'Rubina' },
      { name: 'John Abraham', character: 'Jim' }
    ],
    bunnyVideoId: 'bunny-pathaan-resist',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    downloadUrls: {
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
    },
    isFeatured: false,
    isTrending: true,
    isLatest: true,
    isPopular: true,
    viewsCount: 289000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'movie-8',
    title: 'Legend of Karakoram',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
    description: 'A breathtaking adventure drama following mountain rescue guides enduring extreme blizzards on K2 to rescue a lost expedition.',
    genres: ['Action', 'Pakistani', 'Drama'],
    language: 'Urdu',
    country: 'Pakistan',
    releaseYear: 2024,
    runtime: '2h 05m',
    imdbRating: 8.6,
    director: 'Shoaib Mansoor',
    cast: [
      { name: 'Hamza Ali Abbasi', character: 'Captain Zain' },
      { name: 'Sajal Aly', character: 'Zara' }
    ],
    bunnyVideoId: 'bunny-legend-karakoram',
    directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4',
    downloadUrls: {
      quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4',
      quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4'
    },
    isFeatured: false,
    isTrending: true,
    isLatest: true,
    isPopular: true,
    viewsCount: 175000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
