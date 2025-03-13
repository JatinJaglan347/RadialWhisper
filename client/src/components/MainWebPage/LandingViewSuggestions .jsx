import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageSquare,
  Filter,
  Search,
  ArrowUpDown,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore.js";

const LandingViewSuggestions = () => {
  const { authUser } = useAuthStore();

  // Mock suggestions data
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
    status: "All",
    sort: "latest",
  });
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Categories for filtering
  const categories = [
    "All",
    "Feature Request",
    "UI/UX Improvement",
    "Bug Report",
    "Performance Issue",
    "Documentation",
    "Other",
  ];

  // Statuses for filtering
  const statuses = [
    "All",
    "Under Review",
    "Planned",
    "In Progress",
    "Completed",
    "Declined",
  ];

  // Mock data - would normally come from API
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        title: "Add dark mode option for better night viewing",
        category: "UI/UX Improvement",
        description:
          "It would be great to have a dark mode option to reduce eye strain when using the app at night. This should apply to all screens and menus throughout the app.",
        author: "alex_designs",
        authorAvatar: "/src/assets/avatars/user1.jpg",
        date: "2025-03-10",
        status: "Planned",
        votes: 158,
        comments: 14,
        isVoted: false,
      },
      {
        id: 2,
        title: "Implement collaborative editing for shared projects",
        category: "Feature Request",
        description:
          "Please add the ability for multiple users to edit a project simultaneously, similar to Google Docs. This would greatly improve team collaboration and productivity.",
        author: "teamlead42",
        authorAvatar: "/src/assets/avatars/user2.jpg",
        date: "2025-03-08",
        status: "In Progress",
        votes: 246,
        comments: 28,
        isVoted: true,
      },
      {
        id: 3,
        title: "Fix audio cutting out on long calls",
        category: "Bug Report",
        description:
          "When on calls longer than 30 minutes, audio occasionally cuts out for both parties. This happens on both mobile and desktop versions. Please fix this as it disrupts important meetings.",
        author: "audioexpert",
        authorAvatar: "/src/assets/avatars/user3.jpg",
        date: "2025-03-05",
        status: "Under Review",
        votes: 87,
        comments: 32,
        isVoted: false,
      },
      {
        id: 4,
        title: "Add file version history",
        category: "Feature Request",
        description:
          "It would be helpful to see previous versions of uploaded files and be able to restore them if needed. This would save a lot of time when mistakes are made.",
        author: "designpro",
        authorAvatar: "/src/assets/avatars/user4.jpg",
        date: "2025-03-01",
        status: "Planned",
        votes: 125,
        comments: 8,
        isVoted: false,
      },
      {
        id: 5,
        title: "Improve loading time for large data sets",
        category: "Performance Issue",
        description:
          "When working with databases larger than 10GB, the loading time becomes unbearable. Please optimize the loading process for better performance with large data sets.",
        author: "datascientist",
        authorAvatar: "/src/assets/avatars/user5.jpg",
        date: "2025-02-27",
        status: "Under Review",
        votes: 76,
        comments: 5,
        isVoted: false,
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setSuggestions(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle vote
  const handleVote = (id) => {
    if (!authUser) {
      // Show login prompt or handle unauthorized user
      alert("You need to be logged in to vote");
      return;
    }

    setSuggestions((prev) =>
      prev.map((suggestion) => {
        if (suggestion.id === id) {
          return {
            ...suggestion,
            votes: suggestion.isVoted
              ? suggestion.votes - 1
              : suggestion.votes + 1,
            isVoted: !suggestion.isVoted,
          };
        }
        return suggestion;
      })
    );
  };

  // Handle filter change
  const handleFilterChange = (type, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Toggle expanded suggestion
  const toggleExpand = (id) => {
    setExpandedSuggestion(expandedSuggestion === id ? null : id);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Under Review":
        return "bg-yellow-500";
      case "Planned":
        return "bg-blue-500";
      case "In Progress":
        return "bg-purple-500";
      case "Completed":
        return "bg-green-500";
      case "Declined":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Filter and sort suggestions
  const filteredSuggestions = suggestions
    .filter((suggestion) => {
      const matchesCategory =
        activeFilters.category === "All" ||
        suggestion.category === activeFilters.category;
      const matchesStatus =
        activeFilters.status === "All" ||
        suggestion.status === activeFilters.status;
      const matchesSearch =
        suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (activeFilters.sort) {
        case "latest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "most-voted":
          return b.votes - a.votes;
        case "most-commented":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFF6E0]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" data-aos="fade-up">
      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-[#272829] to-[#31333A] p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#61677A]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search suggestions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#272829] border border-[#61677A] rounded-lg pl-10 pr-4 py-2 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={activeFilters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="appearance-none bg-[#272829] border border-[#61677A] rounded-lg pl-8 pr-8 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#61677A]"
                size={16}
              />
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#61677A]"
                size={16}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={activeFilters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="appearance-none bg-[#272829] border border-[#61677A] rounded-lg pl-8 pr-8 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#61677A]"
                size={16}
              />
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#61677A]"
                size={16}
              />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={activeFilters.sort}
                onChange={(e) =>
                  handleFilterChange(
                    "sort",
                    // This continues from where the first document was cut off

                    e.target.value
                  )
                }
                className="appearance-none bg-[#272829] border border-[#61677A] rounded-lg pl-8 pr-8 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/50 transition-all"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="most-voted">Most Voted</option>
                <option value="most-commented">Most Commented</option>
              </select>
              <ArrowUpDown
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#61677A]"
                size={16}
              />
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#61677A]"
                size={16}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className="my-4 text-[#D8D9DA]">
        {filteredSuggestions.length > 0 ? (
          <p>
            Showing {filteredSuggestions.length}{" "}
            {filteredSuggestions.length === 1 ? "suggestion" : "suggestions"}
          </p>
        ) : (
          <div className="text-center py-8">
            <p className="mb-2">No suggestions match your current filters</p>
            <button
              onClick={() => {
                setActiveFilters({
                  category: "All",
                  status: "All",
                  sort: "latest",
                });
                setSearchQuery("");
              }}
              className="text-[#FFF6E0] underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-gradient-to-br from-[#272829] to-[#31333A] p-4 rounded-xl shadow-lg transition-all hover:shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Upvote column */}
              <div className="flex flex-row md:flex-col items-center justify-start md:justify-center md:min-w-[80px] bg-[#272829] rounded-lg p-2">
                <button
                  onClick={() => handleVote(suggestion.id)}
                  className={`p-2 rounded-full transition-all ${
                    suggestion.isVoted
                      ? "bg-[#FFF6E0] text-[#272829]"
                      : "hover:bg-[#31333A] text-[#D8D9DA]"
                  }`}
                >
                  <ThumbsUp size={20} />
                </button>
                <span className="ml-2 md:ml-0 md:mt-1 font-bold text-lg">
                  {suggestion.votes}
                </span>
              </div>

              {/* Content column */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      suggestion.status
                    )} text-white`}
                  >
                    {suggestion.status}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#31333A] text-[#D8D9DA]">
                    {suggestion.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-1 text-[#FFF6E0]">
                  {suggestion.title}
                </h3>

                <p
                  className={`text-[#D8D9DA] ${
                    expandedSuggestion === suggestion.id ? "" : "line-clamp-2"
                  }`}
                >
                  {suggestion.description}
                </p>

                {suggestion.description.length > 150 && (
                  <button
                    onClick={() => toggleExpand(suggestion.id)}
                    className="text-[#FFF6E0] text-sm mt-1 flex items-center"
                  >
                    {expandedSuggestion === suggestion.id ? (
                      <>
                        Show less <ChevronUp size={16} className="ml-1" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown size={16} className="ml-1" />
                      </>
                    )}
                  </button>
                )}

                <div className="flex items-center gap-4 mt-3 text-sm text-[#61677A]">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{suggestion.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {new Date(suggestion.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare size={14} className="mr-1" />
                    <span>
                      {suggestion.comments}{" "}
                      {suggestion.comments === 1 ? "comment" : "comments"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingViewSuggestions;
