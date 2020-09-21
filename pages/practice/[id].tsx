import ResponsiveDrawer from "../../components/DefaultLayout";
import React, {useEffect} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@material-ui/core";
import Head from "next/head";
import FirebaseInterface from "../../firebase/FirebaseInterface";
import FirebaseLessons from "../../firebase/FirebaseLessons";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Image} from "@material-ui/icons";
import ReactCardFlip from 'react-card-flip';
import Problem from "../../components/problem";

interface Prop {
    route: string;
}

export async function getStaticProps({params}) {
    return {
        props: {
            route: "/practice/" + params.id,
        }
    }
}

export async function getStaticPaths() {
    let data = await FirebaseInterface.getSideNavigation();
    const paths = []
    if (data != null && "sideNavigation" in data) {
        const sideNav = data["sideNavigation"];
        if ("practice" in sideNav) {
            for (let key in sideNav.practice) {
                paths.push("/practice/" + key)
            }
        }
    }
    return {
        paths,
        fallback: false
    }
}

export default function Lesson(props: Prop) {
    const [title, setTitle] = React.useState("");
    const [problems, setProblems] = React.useState([]);
    const {route} = props;
    const loadingData = async () => {
        const uidResponse = await FirebaseInterface.getRouteUid(route);
        if (uidResponse == null) {
            return
        }

        const pageResponse = await FirebaseLessons.getPageByUid(uidResponse.uid);
        const attributes = pageResponse.data();
        setTitle(attributes["Title"])
        if (problems.length == 0) {
            let items = [];
            for (let i of attributes["practice"]) {
                let lesson = await FirebaseLessons.loadLessonByUid(i);
                items.push(lesson);
            }
            setProblems(items);
        }
    }
    loadingData().then()

    return (
        <ResponsiveDrawer
            route={route}
            title={title}>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>

            <div style={{maxWidth: 1080, marginLeft: "auto", marginRight: "auto"}}>
                {problems.map((item: FirebaseLessons, index) => (
                    <Problem
                        index={index}
                        item={item}
                    />
                ))}

            </div>


        </ResponsiveDrawer>
    )
}