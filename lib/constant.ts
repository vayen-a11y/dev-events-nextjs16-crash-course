export type EventItem = {
    id: string;
    title: string;
    description: string;
    slug: string;
    location: string;
    date: string;
    time: string;
    category: "Conference" | "Hackathon" | "Meetup";
    image: string;
};

export const events: EventItem[] = [
    {
        id: "kubecon-cloudnativecon-na-2026",
        title: "KubeCon + CloudNativeCon North America 2026",
        description:
            "Join the cloud native community for talks, workshops, demos, and hands-on sessions covering Kubernetes, containers, observability, platform engineering, and the wider CNCF ecosystem.",
        slug: "kubecon-cloudnativecon-na-2026",
        location: "Austin, TX",
        date: "2026-11-09",
        time: "09:00 AM",
        category: "Conference",
        image: "/images/event1.png",
    },
    {
        id: "aws-reinvent-2026",
        title: "AWS re:Invent 2026",
        description:
            "A week of keynotes, technical sessions, workshops, and networking focused on cloud infrastructure, serverless, data, AI, security, and application development.",
        slug: "aws-reinvent-2026",
        location: "Las Vegas, NV",
        date: "2026-11-30",
        time: "08:00 AM",
        category: "Conference",
        image: "/images/event2.png",
    },
    {
        id: "github-universe-2026",
        title: "GitHub Universe 2026",
        description:
            "Explore the latest in software development, AI-assisted coding, developer productivity, open source, and the GitHub platform alongside developers and engineering leaders.",
        slug: "github-universe-2026",
        location: "San Francisco, CA",
        date: "2026-10-28",
        time: "09:00 AM",
        category: "Conference",
        image: "/images/event3.png",
    },
    {
        id: "hacktoberfest-2026",
        title: "Hacktoberfest 2026",
        description:
            "Take part in a month-long celebration of open source by contributing to projects, collaborating with maintainers, and building your developer portfolio.",
        slug: "hacktoberfest-2026",
        location: "Online",
        date: "2026-10-01",
        time: "12:00 AM",
        category: "Hackathon",
        image: "/images/event4.png",
    },
    {
        id: "react-conf-2026",
        title: "React Conf 2026",
        description:
            "A community-focused event for React developers featuring updates from the React team, practical talks, and conversations about modern frontend development.",
        slug: "react-conf-2026",
        location: "Las Vegas, NV",
        date: "2026-10-15",
        time: "09:00 AM",
        category: "Conference",
        image: "/images/event5.png",
    },
    {
        id: "jsconf-2026",
        title: "JSConf 2026",
        description:
            "A developer conference bringing the JavaScript community together for deep technical talks, emerging web technologies, tooling, and networking.",
        slug: "jsconf-2026",
        location: "New York, NY",
        date: "2026-10-22",
        time: "09:00 AM",
        category: "Meetup",
        image: "/images/event6.png",
    },
    {
        id: "hack-the-north-2026",
        title: "Hack the North 2026",
        description:
            "One of Canada's largest student hackathons, bringing developers, designers, and builders together for a weekend of ambitious projects and experimentation.",
        slug: "hack-the-north-2026",
        location: "Waterloo, ON",
        date: "2026-09-18",
        time: "06:00 PM",
        category: "Hackathon",
        image: "/images/event7.png",
    },
    {
        id: "pycon-us-2026",
        title: "PyCon US 2026",
        description:
            "The annual Python community gathering with tutorials, talks, sprints, open source collaboration, and opportunities to connect with Python developers from around the world.",
        slug: "pycon-us-2026",
        location: "Long Beach, CA",
        date: "2026-05-15",
        time: "09:00 AM",
        category: "Conference",
        image: "/images/event8.png",
    },
    {
        id: "local-dev-meetup-nyc",
        title: "NYC Full-Stack Developers Meetup",
        description:
            "An informal evening for engineers to share practical lessons, side projects, architecture ideas, and techniques for building production-ready web applications.",
        slug: "local-dev-meetup-nyc",
        location: "New York, NY",
        date: "2026-09-24",
        time: "06:30 PM",
        category: "Meetup",
        image: "/images/event1.png",
    },
    {
        id: "ai-builders-hackathon-2026",
        title: "AI Builders Hackathon 2026",
        description:
            "Build useful AI-powered products with fellow developers, experiment with modern models and APIs, and present your project to a community of builders.",
        slug: "ai-builders-hackathon-2026",
        location: "Online",
        date: "2026-10-16",
        time: "09:00 AM",
        category: "Hackathon",
        image: "/images/event2.png",
    },
];

export default events;