import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";
import { IEvent } from "@/lib/database/models/event.model";
import { SearchParamProps } from "@/types";

type UpdateEventPageFormRenderingProps = {
  params: {
    id: string;
  };
};

// const promptId = searchParams.get("id");

const CreateEvent = async({params: {id}, searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;
  const event = await getEventById({id})

  // const UpdateEventFormPage = async ({params: {id}, searchParams }: SearchParamProps) => {
  //     const { sessionClaims } = auth();

  //     const userId = sessionClaims?.userId as string;
  //     // const event = await getEventById({id})

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} event={event} type="Update" />
      </div>
    </>
    // <>
    //     <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
    //       <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
    //     </section>
    //     <div className="wrapper my-8">
    //         <EventForm
    //         // event={event}
    //         // id={event._id}
    //         userId={userId}
    //         type="Create"
    //         />
    //     </div>
    // </>
  );
};

export default CreateEvent; //UpdateEventFormPage
