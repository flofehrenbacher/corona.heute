import { DragHandleIcon } from '@chakra-ui/icons'
import { theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { AGS, useCurrentRKIData } from 'hooks/use-current-rki-data'
import { useMyDistricts } from 'hooks/use-my-districts'
import { move } from 'ramda'
import React from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { UpdateState } from 'use-local-storage-state/src/useLocalStorageStateBase'

export function MoveDistricts() {
  const { myDistricts, setMyDistricts } = useMyDistricts()
  const { districts } = useCurrentRKIData()

  return (
    <DragDropContext onDragEnd={dragEvents.onDragEnd({ myDistricts, setMyDistricts })}>
      <Droppable droppableId="myDistricts">
        {(provided, { isDraggingOver }) => (
          <ol
            css={styles.list(isDraggingOver)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {myDistricts.map((district, i) => (
              <Draggable draggableId={district} index={i} key={district}>
                {(provided) => (
                  <li
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    css={styles.draggableDistrict}
                  >
                    <DragHandleIcon mr="3" />
                    <span>{districts[district].county}</span>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const styles = {
  list: (isDraggingOver: boolean) => css`
    background-color: ${isDraggingOver ? theme.colors.gray[200] : 'transparent'};
    border-radius: 9px;
    box-shadow: 0 0 0 10px ${isDraggingOver ? theme.colors.gray[200] : 'transparent'};
    list-style-type: none;
    margin-top: ${theme.space[4]};
    margin-bottom: ${theme.space[4]};
  `,
  draggableDistrict: css`
    padding: ${theme.space[4]};
  `,
}

const dragEvents = {
  onDragEnd: ({
    myDistricts,
    setMyDistricts,
  }: {
    myDistricts: AGS[]
    setMyDistricts: UpdateState<string[]>
  }) => ({ destination, source }: DropResult) => {
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    ) {
      return
    }

    const newOrderedDistricts = move(source.index, destination.index, myDistricts)

    setMyDistricts(newOrderedDistricts)
  },
}
