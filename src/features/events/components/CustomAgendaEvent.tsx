import type { CustomAgendaEventProps } from "../types";

export default function CustomAgendaEvent({ event }: CustomAgendaEventProps) {
  return (
    <article className="p-1 cursor-pointer hover:bg-gray-100">
      <h3 className="font-bold">Task: {event.title}</h3>
      {event.description && <div>Description: {event.description}</div>}
      <div> Priority: {event.importance || "low"}</div>
    </article>
  );
}
