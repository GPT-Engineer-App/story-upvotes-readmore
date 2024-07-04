import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchTopStories = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyResponse.json();
    })
  );
  return stories;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <Skeleton key={index} className="w-full h-24" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error loading stories</div>;
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredStories.map((story) => (
        <Card key={story.id}>
          <CardHeader>
            <CardTitle>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                {story.title}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{story.score} upvotes</p>
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Index;