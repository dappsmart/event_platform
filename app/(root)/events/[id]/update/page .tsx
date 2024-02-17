import EventForm from "@/components/shared/EventForm"
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs"
import { IEvent } from '@/lib/database/models/event.model'


type UpdateEventProps = {
  params: {
    eventId: string
  }
}

// const promptId = searchParams.get("id");



const UpdateEvent = async ({ params: { eventId } }: UpdateEventProps) => {
    const {sessionClaims} = auth();

    const userId = sessionClaims?.userId as string;
    const event = await getEventById(eventId)

  return (
    <>
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
        </section>
        <div className="wrapper my-8">
            <EventForm
            event={event}
            eventId={event._id}  
            userId={userId} 
            type="Update" 
            />
        </div>
    </>
  )
}

export default UpdateEvent