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

  const { mutate: createColumn } = api.kanbanRouter.createColumn.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },

    onError: (error) => {
      console.error(error);
    },
  });

  function handleCreateColumn() {
    createColumn({
      kanbanBoardId: id,
      name: "new col",
    });
  }

  if (fetchStatus === "loading") {
    return <div>loading</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="flex h-full  w-fit gap-2 overflow-x-auto">
        {initialKanban?.map((column) => (
          <Column key={column.id} column={column} />
        ))}
        <button onClick={handleCreateColumn}>new col</button>
      </section>
    </DragDropContext>
  );
};

export default KanbanBoard;
