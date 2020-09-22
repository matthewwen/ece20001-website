import React, {Component, useEffect} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReactCardFlip from "react-card-flip";
import FirebaseLessons from "../firebase/FirebaseLessons";

export default class Problem extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            isFlipped: false,
            classes: null,
            problemSRC: null,
            solutionSRC: null
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }

    componentDidMount() {
        const {item} = this.props;
        if (item.problemFirebasePath != null) {
            FirebaseLessons.getFirebasePicture(item.problemFirebasePath).then((data) => {
                this.setState({problemSRC: data});
            })
        }
        if (item.solutionFirebasePath != null) {
            FirebaseLessons.getFirebasePicture(item.solutionFirebasePath).then((data) => {
                this.setState({solutionSRC: data});
            })
        }
    }

    render() {
        const {index, item} = this.props;
        return (
            <Accordion
                key={"Problem" + index}
                defaultExpanded={index == 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant={"h6"} style={{flex: 1}}>{item.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{width: "100%"}}>
                        <ReactCardFlip
                            isFlipped={this.state.isFlipped} flipDirection="vertical">
                            <Card style={{width: "100%"}}
                            >
                                <CardContent className={"card"}>
                                    {item.description &&
                                        <Typography>{item.description}</Typography>
                                    }
                                    {this.state.problemSRC &&
                                    <img
                                        src={this.state.problemSRC}
                                        style={{width: "100%"}}
                                        alt={"problem"}/>
                                    }
                                </CardContent>
                                <CardActions>
                                    <Button size={"small"} onClick={this.handleClick}>Get Solution</Button>
                                </CardActions>
                            </Card>

                            <Card>
                                <CardContent style={{width: "100%"}}>
                                    {this.state.solutionSRC &&
                                        <img
                                            src={this.state.solutionSRC}
                                            style={{width: "100%"}}
                                            alt={"solution"}
                                        />
                                    }
                                    {item.note &&
                                        <Typography>{item.note}</Typography>
                                    }
                                </CardContent>
                                <CardActions>
                                    <Button size={"small"} onClick={this.handleClick}>Get Problem</Button>
                                </CardActions>
                            </Card>
                        </ReactCardFlip>
                    </div>
                </AccordionDetails>
            </Accordion>
        )
    }

}