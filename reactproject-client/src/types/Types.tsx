


export type user = {
  Id: number,
  Name: string,
  Password: string,
  Phone: string,
  UserName: string,
  Email: string,
  Tz: string
}

export type Ingrident = {

  Name: string
  Count: number
  Type: string

}

export type Instruction = { Name: string };

export type Recipe = {
  Id: number,
  Name: string,
  Instructions: Instruction[];
  Difficulty: 'קל' | 'בינוני' | 'קשה',
  Duration: number,
  Img: string,
  Ingridents: Ingrident[]
  UserId: number,
  Categoryid: number,
  Description: string

}
export type Category =
  {
    Id: number,
    Name: string,


  }