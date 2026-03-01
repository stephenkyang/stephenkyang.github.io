export default function WritingDetail({ writing }) {
  const Component = writing.component
  const paragraphs = writing.content ? writing.content.split('\n\n') : []

  return (
    <div className="writing-detail">
      <h1 className="writing-detail-title">{writing.title}</h1>
      <p className="writing-detail-date">{writing.date}</p>
      {writing.image && (
        <img className="writing-detail-image" src={writing.image} alt="" />
      )}
      <div className="writing-detail-content">
        {Component ? <Component /> : paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  )
}
