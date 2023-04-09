import { DragDropContext } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import Column from "~/components/Column";
import { api } from "~/utils/api";

interface KanbanBoardProps {
  id: string;
}

const KanbanBoard = ({ id }: KanbanBoardProps) => {
  const ctx = api.useContext();
  const { data: initialKanban, status: fetchStatus } =
    api.kanbanRouter.getColumns.useQuery({
      kanbanBoardId: id,
    });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = initialKanban?.find(
      (column) => column.id === source.droppableId
    );
    const destinationColumn = initialKanban?.find(
      (column) => column.id === destination.droppableId
    );

    if (!sourceColumn || !destinationColumn) {
      return;
    }

    const task = sourceColumn.cards[source.index];
    sourceColumn.cards.splice(source.index, 1);

    if (!task) {
      return;
    }
    destinationColumn.cards.splice(destination.index, 0, task);

    mutate({
      sourceColumnId: source.droppableId,
      taskId: task.id,
      destinationColumnId: destination.droppableId,
    });
  };

  const { mutate } = api.kanbanRouter.moveTask.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });
  if (fetchStatus === "loading") {
    return <div>loading</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-2">
        {initialKanban?.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
