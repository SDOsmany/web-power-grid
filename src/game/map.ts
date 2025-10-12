import { City } from '../types/game';

// Simplified USA map for Power Grid
export const USA_MAP: City[] = [
  // Northwest Region
  {
    id: 'seattle',
    name: 'Seattle',
    region: 'northwest',
    connections: [
      { cityId: 'portland', cost: 3 },
      { cityId: 'boise', cost: 8 },
    ],
  },
  {
    id: 'portland',
    name: 'Portland',
    region: 'northwest',
    connections: [
      { cityId: 'seattle', cost: 3 },
      { cityId: 'boise', cost: 13 },
      { cityId: 'san-francisco', cost: 14 },
    ],
  },
  {
    id: 'boise',
    name: 'Boise',
    region: 'northwest',
    connections: [
      { cityId: 'seattle', cost: 8 },
      { cityId: 'portland', cost: 13 },
      { cityId: 'salt-lake-city', cost: 8 },
    ],
  },

  // Southwest Region
  {
    id: 'san-francisco',
    name: 'San Francisco',
    region: 'southwest',
    connections: [
      { cityId: 'portland', cost: 14 },
      { cityId: 'las-vegas', cost: 10 },
      { cityId: 'los-angeles', cost: 10 },
    ],
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    region: 'southwest',
    connections: [
      { cityId: 'san-francisco', cost: 10 },
      { cityId: 'las-vegas', cost: 9 },
      { cityId: 'san-diego', cost: 3 },
      { cityId: 'phoenix', cost: 11 },
    ],
  },
  {
    id: 'san-diego',
    name: 'San Diego',
    region: 'southwest',
    connections: [
      { cityId: 'los-angeles', cost: 3 },
      { cityId: 'phoenix', cost: 14 },
    ],
  },
  {
    id: 'las-vegas',
    name: 'Las Vegas',
    region: 'southwest',
    connections: [
      { cityId: 'san-francisco', cost: 10 },
      { cityId: 'los-angeles', cost: 9 },
      { cityId: 'salt-lake-city', cost: 18 },
    ],
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    region: 'southwest',
    connections: [
      { cityId: 'los-angeles', cost: 11 },
      { cityId: 'san-diego', cost: 14 },
      { cityId: 'santa-fe', cost: 18 },
    ],
  },

  // Central Region
  {
    id: 'salt-lake-city',
    name: 'Salt Lake City',
    region: 'central',
    connections: [
      { cityId: 'boise', cost: 8 },
      { cityId: 'las-vegas', cost: 18 },
      { cityId: 'denver', cost: 21 },
    ],
  },
  {
    id: 'denver',
    name: 'Denver',
    region: 'central',
    connections: [
      { cityId: 'salt-lake-city', cost: 21 },
      { cityId: 'santa-fe', cost: 13 },
      { cityId: 'kansas-city', cost: 16 },
      { cityId: 'omaha', cost: 14 },
    ],
  },
  {
    id: 'santa-fe',
    name: 'Santa Fe',
    region: 'central',
    connections: [
      { cityId: 'phoenix', cost: 18 },
      { cityId: 'denver', cost: 13 },
      { cityId: 'kansas-city', cost: 16 },
      { cityId: 'dallas', cost: 16 },
    ],
  },

  // South Region
  {
    id: 'dallas',
    name: 'Dallas',
    region: 'south',
    connections: [
      { cityId: 'santa-fe', cost: 16 },
      { cityId: 'kansas-city', cost: 12 },
      { cityId: 'memphis', cost: 12 },
      { cityId: 'houston', cost: 5 },
    ],
  },
  {
    id: 'houston',
    name: 'Houston',
    region: 'south',
    connections: [
      { cityId: 'dallas', cost: 5 },
      { cityId: 'new-orleans', cost: 8 },
    ],
  },
  {
    id: 'new-orleans',
    name: 'New Orleans',
    region: 'south',
    connections: [
      { cityId: 'houston', cost: 8 },
      { cityId: 'memphis', cost: 7 },
      { cityId: 'birmingham', cost: 11 },
    ],
  },

  // Midwest Region
  {
    id: 'omaha',
    name: 'Omaha',
    region: 'midwest',
    connections: [
      { cityId: 'denver', cost: 14 },
      { cityId: 'kansas-city', cost: 5 },
      { cityId: 'chicago', cost: 13 },
    ],
  },
  {
    id: 'kansas-city',
    name: 'Kansas City',
    region: 'midwest',
    connections: [
      { cityId: 'denver', cost: 16 },
      { cityId: 'santa-fe', cost: 16 },
      { cityId: 'omaha', cost: 5 },
      { cityId: 'chicago', cost: 8 },
      { cityId: 'dallas', cost: 12 },
      { cityId: 'memphis', cost: 12 },
    ],
  },
  {
    id: 'chicago',
    name: 'Chicago',
    region: 'midwest',
    connections: [
      { cityId: 'omaha', cost: 13 },
      { cityId: 'kansas-city', cost: 8 },
      { cityId: 'memphis', cost: 7 },
      { cityId: 'cincinnati', cost: 7 },
      { cityId: 'detroit', cost: 7 },
    ],
  },
  {
    id: 'memphis',
    name: 'Memphis',
    region: 'midwest',
    connections: [
      { cityId: 'dallas', cost: 12 },
      { cityId: 'kansas-city', cost: 12 },
      { cityId: 'chicago', cost: 7 },
      { cityId: 'cincinnati', cost: 12 },
      { cityId: 'birmingham', cost: 6 },
      { cityId: 'new-orleans', cost: 7 },
    ],
  },

  // Southeast Region
  {
    id: 'birmingham',
    name: 'Birmingham',
    region: 'southeast',
    connections: [
      { cityId: 'memphis', cost: 6 },
      { cityId: 'new-orleans', cost: 11 },
      { cityId: 'atlanta', cost: 3 },
    ],
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    region: 'southeast',
    connections: [
      { cityId: 'birmingham', cost: 3 },
      { cityId: 'cincinnati', cost: 15 },
      { cityId: 'raleigh', cost: 7 },
      { cityId: 'savannah', cost: 7 },
    ],
  },
  {
    id: 'savannah',
    name: 'Savannah',
    region: 'southeast',
    connections: [
      { cityId: 'atlanta', cost: 7 },
      { cityId: 'raleigh', cost: 7 },
      { cityId: 'jacksonville', cost: 0 },
    ],
  },
  {
    id: 'jacksonville',
    name: 'Jacksonville',
    region: 'southeast',
    connections: [
      { cityId: 'savannah', cost: 0 },
      { cityId: 'tampa', cost: 4 },
    ],
  },
  {
    id: 'tampa',
    name: 'Tampa',
    region: 'southeast',
    connections: [
      { cityId: 'jacksonville', cost: 4 },
      { cityId: 'miami', cost: 4 },
    ],
  },
  {
    id: 'miami',
    name: 'Miami',
    region: 'southeast',
    connections: [{ cityId: 'tampa', cost: 4 }],
  },

  // Northeast Region
  {
    id: 'detroit',
    name: 'Detroit',
    region: 'northeast',
    connections: [
      { cityId: 'chicago', cost: 7 },
      { cityId: 'cincinnati', cost: 4 },
      { cityId: 'pittsburgh', cost: 6 },
    ],
  },
  {
    id: 'cincinnati',
    name: 'Cincinnati',
    region: 'northeast',
    connections: [
      { cityId: 'chicago', cost: 7 },
      { cityId: 'memphis', cost: 12 },
      { cityId: 'detroit', cost: 4 },
      { cityId: 'pittsburgh', cost: 7 },
      { cityId: 'knoxville', cost: 6 },
      { cityId: 'atlanta', cost: 15 },
    ],
  },
  {
    id: 'knoxville',
    name: 'Knoxville',
    region: 'northeast',
    connections: [
      { cityId: 'cincinnati', cost: 6 },
      { cityId: 'raleigh', cost: 3 },
      { cityId: 'atlanta', cost: 5 },
    ],
  },
  {
    id: 'pittsburgh',
    name: 'Pittsburgh',
    region: 'northeast',
    connections: [
      { cityId: 'detroit', cost: 6 },
      { cityId: 'cincinnati', cost: 7 },
      { cityId: 'knoxville', cost: 5 },
      { cityId: 'raleigh', cost: 3 },
      { cityId: 'washington', cost: 6 },
    ],
  },
  {
    id: 'raleigh',
    name: 'Raleigh',
    region: 'northeast',
    connections: [
      { cityId: 'knoxville', cost: 3 },
      { cityId: 'pittsburgh', cost: 3 },
      { cityId: 'atlanta', cost: 7 },
      { cityId: 'savannah', cost: 7 },
      { cityId: 'washington', cost: 1 },
    ],
  },
  {
    id: 'washington',
    name: 'Washington',
    region: 'northeast',
    connections: [
      { cityId: 'pittsburgh', cost: 6 },
      { cityId: 'raleigh', cost: 1 },
      { cityId: 'philadelphia', cost: 3 },
    ],
  },
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    region: 'northeast',
    connections: [
      { cityId: 'washington', cost: 3 },
      { cityId: 'new-york', cost: 0 },
    ],
  },
  {
    id: 'new-york',
    name: 'New York',
    region: 'northeast',
    connections: [
      { cityId: 'philadelphia', cost: 0 },
      { cityId: 'boston', cost: 3 },
    ],
  },
  {
    id: 'boston',
    name: 'Boston',
    region: 'northeast',
    connections: [{ cityId: 'new-york', cost: 3 }],
  },
];
