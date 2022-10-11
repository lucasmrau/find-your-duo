import { Check, GameController } from "phosphor-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "./Form/Input";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useEffect, useState, FormEvent } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import axios from 'axios';

interface Game {
  id: string;
  title: string;
}

export function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel]= useState(false)

  useEffect(() => {
    axios("http://localhost:3333/games").then(response=> {
      setGames(response.data)
      })
    }, [])

  async function handleCreateAd(event: FormEvent){
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement)
      const data = Object.fromEntries(formData)

      if(!data.name){
        return;
      }

       try {
        await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        "name":"data.name",
        "yearsPlaying": Number(data.yearsPlaying),
        "discord": data.discord,
        "weekDays": weekDays.map(Number),
        "hourStart": data.hourStart,
        "hourEnd": data.hourEnd,
        "useVoiceChannel": useVoiceChannel
      })

      alert('Ad created with sucess!')
      } catch(err){
        console.log(err);
        alert('Error to created!')
      }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />

      <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black">Post an Ad</Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">
              What is the game?
            </label>
            <select
              id="game"
              name="game"
              className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
              defaultValue=""
            >
              <option disabled value="">
                Select the game you would like to play
              </option>

              {games.map((game) => {
                return (
                  <option key={game.id} value={game.id}>
                    {game.title}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Your name(or nickname)</label>
            <Input 
            id="name" 
            name="name" 
            placeholder="How do they call you in the game?" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearPlaying">How long playing?</label>
              <Input 
              id="yearsPlaying" 
              name="yearsPlaying" 
              type="number" 
              placeholder="Ok be ZERO" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Whats's your discord?</label>
              <Input 
              id="discord" 
              name="discord"
              type="text" 
              placeholder="User#0000" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">When do you usually play?</label>

              <ToggleGroup.Root
                type="multiple"
                className="grid grid-cols-4 gap-2"
                value={weekDays}
                onValueChange={setWeekDays}
              >
                <ToggleGroup.Item
                  value="0"
                  title="Sunday"
                  className={`w-8 h-8 rounded
                  ${weekDays.includes("0") ? "bg-violet-500" : " bg-zinc-900"}`}
                >
                  D
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="1"
                  title="Monday"
                  className={`w-8 h-8 rounded 
                  ${weekDays.includes("1") ? "bg-violet-500" : " bg-zinc-900"}`}
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="2"
                  title="Thursday"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("2") ? "bg-violet-500" : " bg-zinc-900"
                  }`}
                >
                  T
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="3"
                  title="Wednesday"
                  className={`w-8 h-8 rounded  ${
                    weekDays.includes("3") ? "bg-violet-500" : " bg-zinc-900"
                  }`}
                >
                  W
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="4"
                  title="Tuesday"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("4") ? "bg-violet-500" : " bg-zinc-900"
                  }`}
                >
                  T
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="5"
                  title="Friday"
                  className={`w-8 h-8 rounded
                  ${weekDays.includes("5") ? "bg-violet-500" : "bg-zinc-900 "}`}
                >
                  F
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="6"
                  title="Saturday"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("6") ? "bg-violet-500" : " bg-zinc-900"
                  }`}
                >
                  S
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="hourStart">What time?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input 
                name="hourStart" 
                id="hourStart" 
                type="time" 
                placeholder="From" />
                <Input 
                name="hourEnd" 
                id="hourEnd" 
                type="time" 
                placeholder="Until" />
              </div>
            </div>
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm">
            <Checkbox.Root 
            checked={useVoiceChannel}
            className="w-6 h-6 rounded bg-zinc-900 p-1"
            onCheckedChange={(checked)=>{
              if(checked === true) {
                setUseVoiceChannel(true)    
              } else {
                setUseVoiceChannel(false)
              }
            }}>
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-emerald-400" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            Used to connect with voice chat
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close className="bg-zinc-500 px-5 h-12 rounded-md font-semibold  hover:bg-zinc-600">
              Cancel
            </Dialog.Close>
            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
            >
              <GameController size={24} /> Find your duo
            </button>
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}


