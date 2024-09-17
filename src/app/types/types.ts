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
    name: string;
    email: string;
    image: string;
    level: string;
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