import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";


const BASE_URL = process.env.BASE_URL;

const Page = async () => {

    if (!BASE_URL) {
        throw new Error("BASE_URL is not defined");
    }

    const response = await fetch(`${BASE_URL}/api/events`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();

    const events: IEvent[] = data.events ?? [];

    return (
        <section>
            <h1 className="text-center">
                The Hub for Every Dev <br /> Event You Can't Miss
            </h1>

            <p className="text-center mt-5">
                Hackathons, Meetups, and Conferences, All in One Place
            </p>

            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                {events.length > 0 ? (
                    <ul className="events">
                        {events.map((event : IEvent) => (
                            <li className="list-none" key={event._id?.toString() ?? event.slug }>
                                <EventCard
                                    {...event}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </section>
    );
};

export default Page;