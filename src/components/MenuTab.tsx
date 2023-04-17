import { IconType } from "react-icons";

function MenuTab(props: { name: string; icon: IconType; className?: string }) {
  return (
    <span className="flex  w-full  items-center gap-2   ">
      <span className="text-3xl lg:text-2xl "> {<props.icon />} </span>{" "}
      <h1 className="hidden text-lg lg:block">{props.name}</h1>
    </span>
  );
}

export default MenuTab;
