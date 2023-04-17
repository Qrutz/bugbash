import { IconType } from "react-icons";

function MenuTab(props: { name: string; icon: IconType; className?: string }) {
  return (
    <span className="flex items-center  gap-2  text-lg ">
      <span className="text-xl"> {<props.icon />} </span>{" "}
      <h1 className="text-lg ">{props.name}</h1>
    </span>
  );
}

export default MenuTab;
