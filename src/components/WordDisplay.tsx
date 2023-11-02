import { Badge, Card, CardBody } from "reactstrap";

export const WordDisplay = (props: {
  word?: string,
  partOfSpeech?: string,
  usageExample?: string
}) => (
  <Card className='w-50'>
    <CardBody>
      <Badge pill className='mx-3' color='warning'>
        {props.partOfSpeech}
      </Badge>
      <h1 className='mt-2'>
        {props.word}
      </h1>
      <div className='mt-2'>
        {props.usageExample && `"${props.usageExample}"`}
      </div>
    </CardBody>
  </Card>
)