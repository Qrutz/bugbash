import { IconType } from "react-icons";

function MenuTab(props: { name: string; icon: IconType }) {
  return (
    <span className="to-bg-neutral-800 flex w-full cursor-pointer justify-between rounded-md from-slate-800 to-slate-900 p-2 hover:bg-gradient-to-r">
      <span className="flex items-center gap-2 text-lg">
        <span className="text-xl"> {<props.icon />} </span>{" "}
        <h1>{props.name}</h1>
      </span>
      {/* <span className="w-[10%] rounded-md bg-red-600 text-center">4</span> */}
    </span>
  );
}

export default MenuTab;
