export interface Session {
    _id: string;
    date: string;
    time: string;
    coach_name: string;
    session_link: string;
  }
  export interface RoundsTiming {
    description: string; 
  }
  export interface FileData {
    id: string;
    move:string;
    solution: string;
    sid_link: string;
  }
  export interface PuzzleData {
    live_link: string;
    _id: string;
    date_time: string;
    level: string;
    category: string;
    title: string;
    live: string;
    file_ids: { [columnName: string]: FileData };
  }
  export interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    puzzleData: PuzzleData | null;
    columnName: string | "puzzle1";
  }
  export interface Section {
    name: string;
    registrationFee: string;
  }
  export interface FormData {
    date: Date | null;
    hour: string;
    minute: string;
    period: string;
    coach_name: string;
    session_link: string;
  }
  
  export interface Tournament {
    [x: string]: any;
    type: string;
    name: string;
    location: string;
    timeControl: string;
    upcomingDates: string[];
    roundsTiming: RoundsTiming;
    sections: Section[];
  }
  export interface Scores {
    Opening: number;
    Middlegame: number;
    Endgame: number;
    Mixed: number;
  }
  export interface Student {
    name: string;
    email: string;
    level: string;
    image: string;
    scores?: {
      Opening: number;
      Middlegame: number;
      Endgame: number;
      Mixed: number;
    };
    PuzzleArena?: {
      [category: string]: {
        [part: string]: {
          [puzzle: string]: {
            started: boolean;
            option_guessed: number | null;
            timer:number|0;
            score: number;
          };
        };
      };
    };
  }
  export interface UserDetails {
    profile_id: string | "student"; // User role can be "student" or a specific profile ID
    name: string; // Full name (first and last combined)
    email: string;
    image: string; // URL to the user's profile image
    level: string; // User's current level in chess
  
    scores?: {
      Opening: number;
      Middlegame: number;
      Endgame: number;
      Mixed: number;
    };
  
    PuzzleArena?: {
      [category: string]: {
        [part: string]: {
          [puzzle: string]: {
            started: boolean; // Whether the puzzle has started
            option_guessed: number | null; // Option guessed by the user
            timer: number | 0; // Time spent on the puzzle
            score: number; // Score achieved in the puzzle
          };
        };
      };
    };
  
    phone?: string; // Optional phone number field
    payment_status?: string; // Status of user's payment (e.g., "paid", "pending", etc.)
    
    child_name?: {
      first: string;
      last: string;
    };
  
    parent_name?: {
      first: string;
      last: string;
    };
  
    school_name?: string; // Name of the school, optional
    group?: string; // Group or team the user belongs to, optional
    session_id?: string; // Identifier for the user's current session
  
    RequestFinancialAssistance?: boolean; // Indicates if the user has requested financial assistance
  }
  
  

  export interface ImageData {
    id: string;
    filename: string;
    url: string;
  }
  
export interface UpcomingActivity {
  session_link: string;
  title: string;
  date: string;
  time: string;
}