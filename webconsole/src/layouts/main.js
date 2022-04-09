
import Motion from '../components/sensors/motion'
import {Container, Row} from 'react-bootstrap'


function Main() {
    return (
        <Container fluid>
            <Row>
                Welcome
            </Row>
            <Row id="dataDisplay">
              <Motion />
            </Row>
        </Container>
    )
}
export default Main;