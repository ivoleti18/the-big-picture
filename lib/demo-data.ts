import type { Topic } from './types';

export const demoTopics: Topic[] = [
  {
    id: 'nuclear-energy',
    name: 'Nuclear Energy',
    description: 'The debate around nuclear power as a climate solution versus safety concerns',
    subTopics: [
      {
        id: 'climate-benefits',
        name: 'Climate Benefits',
        description: 'Nuclear energy as a zero-carbon power source',
        articles: [
          {
            id: 'climate-1',
            title: 'Nuclear Power: Essential for Net Zero Goals',
            source: 'The Guardian',
            leaning: 'lean-left',
            summary: [
              'Nuclear power generates electricity without direct carbon emissions, making it a crucial tool in the fight against climate change.',
              'The International Energy Agency reports that nuclear currently provides about 10% of global electricity and is the second-largest source of low-carbon power after hydropower.',
              'Advocates argue that reaching net-zero emissions by 2050 will be significantly harder without expanding nuclear capacity, as it provides reliable baseload power that intermittent renewables cannot.',
              'Modern reactor designs promise improved efficiency and reduced waste, addressing some historical concerns about the technology.'
            ],
            keyFacts: ['10% of global electricity', 'Second-largest low-carbon source', 'Zero direct emissions']
          },
          {
            id: 'climate-2',
            title: 'Why Environmentalists Are Reconsidering Nuclear',
            source: 'Scientific American',
            leaning: 'center',
            summary: [
              'A growing number of environmental scientists are advocating for nuclear power as part of a comprehensive climate strategy.',
              'Studies show that lifecycle emissions from nuclear are comparable to wind power and lower than solar when accounting for manufacturing and construction.',
              'The reliability of nuclear power (90%+ capacity factor) makes it valuable for grid stability as more variable renewable sources come online.',
              'Some prominent climate activists, including James Hansen, argue that anti-nuclear policies have inadvertently slowed climate progress.'
            ],
            keyFacts: ['90%+ capacity factor', 'Low lifecycle emissions', 'Grid stability benefits']
          },
          {
            id: 'climate-3',
            title: 'Nuclear Investment Is Climate Investment',
            source: 'Wall Street Journal',
            leaning: 'lean-right',
            summary: [
              'Private sector investment in nuclear technology is surging, with tech giants backing next-generation reactor development.',
              'Economic analyses suggest nuclear provides the most cost-effective pathway to deep decarbonization when considering full system costs.',
              'Countries that have phased out nuclear, like Germany, have seen emissions remain elevated or increase as they rely more on fossil fuels for baseload power.',
              'Market-based approaches to carbon reduction naturally favor nuclear due to its scalability and reliability.'
            ],
            keyFacts: ['Tech giants investing', 'Cost-effective decarbonization', 'Germany emissions impact']
          }
        ]
      },
      {
        id: 'safety-concerns',
        name: 'Safety Concerns',
        description: 'Risks and safety considerations of nuclear power',
        articles: [
          {
            id: 'safety-1',
            title: 'The Hidden Costs of Nuclear Accidents',
            source: 'Mother Jones',
            leaning: 'left',
            summary: [
              'Nuclear accidents, while rare, have devastating and long-lasting consequences that extend far beyond the immediate disaster zone.',
              'The Fukushima disaster led to the displacement of over 150,000 people, with many still unable to return to their homes more than a decade later.',
              'Health studies continue to reveal elevated cancer rates in areas affected by Chernobyl, with estimates of total deaths ranging from 4,000 to 93,000.',
              'The psychological toll on communities near nuclear facilities, including anxiety and depression, is often overlooked in cost-benefit analyses.',
              'Cleanup costs for major accidents often exceed initial estimates by factors of 10 or more, ultimately borne by taxpayers.'
            ],
            keyFacts: ['150,000 displaced at Fukushima', 'Long-term health impacts', 'Cleanup costs exceed estimates']
          },
          {
            id: 'safety-2',
            title: 'Modern Nuclear Safety: Lessons Learned',
            source: 'Reuters',
            leaning: 'neutral',
            summary: [
              'The nuclear industry has implemented significant safety improvements since major accidents, including passive safety systems that require no human intervention.',
              'Statistical analysis shows that nuclear power has one of the lowest death rates per unit of energy produced among all power sources, including solar and wind.',
              'New Generation IV reactor designs incorporate features that make meltdowns physically impossible through passive cooling systems.',
              'Regulatory frameworks have been strengthened globally, with more rigorous oversight and international cooperation on safety standards.'
            ],
            keyFacts: ['Lowest death rate per energy unit', 'Passive safety systems', 'Gen IV designs']
          },
          {
            id: 'safety-3',
            title: 'Nuclear Waste: The Unsolved Problem',
            source: 'The Atlantic',
            leaning: 'lean-left',
            summary: [
              'Despite decades of nuclear power generation, no country has successfully implemented a permanent storage solution for high-level radioactive waste.',
              'Current spent fuel sits in temporary storage at reactor sites across the country, creating distributed security and environmental risks.',
              'The Yucca Mountain repository, after $15 billion in development, remains politically deadlocked and may never open.',
              'Some experts argue that advanced reactors could reduce waste volumes, but these technologies remain largely unproven at commercial scale.'
            ],
            keyFacts: ['No permanent storage solution', '$15B spent on Yucca Mountain', 'Waste remains at reactor sites']
          }
        ]
      },
      {
        id: 'economics',
        name: 'Economic Factors',
        description: 'Cost and economic viability of nuclear power',
        articles: [
          {
            id: 'econ-1',
            title: 'Nuclear Cost Overruns Threaten Industry Future',
            source: 'Bloomberg',
            leaning: 'center',
            summary: [
              'Recent nuclear construction projects in the West have faced severe cost overruns, with the Vogtle plant in Georgia now estimated at over $30 billion—more than double original projections.',
              'Construction timelines have similarly expanded, with projects routinely taking 10-15 years compared to planned 5-7 year schedules.',
              'These economics have led several utilities to cancel planned reactors in favor of natural gas or renewable projects.',
              'However, some analysts note that standardized designs and modular construction could dramatically reduce costs if regulatory barriers are addressed.'
            ],
            keyFacts: ['Vogtle: $30B vs original estimates', '10-15 year construction times', 'Cancellations due to costs']
          },
          {
            id: 'econ-2',
            title: 'Small Modular Reactors: The Economic Game Changer',
            source: 'Forbes',
            leaning: 'lean-right',
            summary: [
              'Small modular reactors (SMRs) promise to revolutionize nuclear economics through factory manufacturing and standardized designs.',
              'Companies like NuScale and TerraPower are attracting billions in private investment betting on this new approach.',
              'SMRs could serve markets traditional large reactors cannot, including remote communities, industrial facilities, and developing nations.',
              'Proponents estimate SMRs could achieve costs competitive with natural gas by the early 2030s if deployment proceeds at scale.'
            ],
            keyFacts: ['Factory manufacturing', 'Billions in private investment', 'Competitive by 2030s']
          }
        ]
      }
    ]
  },
  {
    id: 'remote-work',
    name: 'Remote Work',
    description: 'The ongoing debate about productivity, social health, and the future of work',
    subTopics: [
      {
        id: 'productivity',
        name: 'Productivity Impact',
        description: 'How remote work affects worker output and efficiency',
        articles: [
          {
            id: 'prod-1',
            title: 'Remote Workers Are More Productive, Study Finds',
            source: 'Harvard Business Review',
            leaning: 'center',
            summary: [
              'A comprehensive Stanford study found that remote workers showed a 13% performance increase compared to their in-office counterparts.',
              'The productivity gains were attributed to fewer distractions, reduced commute stress, and more comfortable work environments.',
              'Remote workers reported higher job satisfaction and were 50% less likely to leave their positions.',
              'However, the study noted that results varied significantly by job type, with creative and collaborative roles showing more mixed results.'
            ],
            keyFacts: ['13% productivity increase', '50% lower turnover', 'Results vary by role']
          },
          {
            id: 'prod-2',
            title: 'The Hidden Productivity Tax of Remote Work',
            source: 'Wall Street Journal',
            leaning: 'lean-right',
            summary: [
              'New research suggests that remote work productivity gains may be overstated, with some companies seeing a 10-20% decline in output.',
              'Communication overhead has increased substantially, with employees spending more time in virtual meetings and on asynchronous messaging.',
              'Mentorship and knowledge transfer have suffered, particularly for junior employees who lack informal learning opportunities.',
              'Several major companies including Goldman Sachs and JPMorgan have mandated return-to-office, citing productivity concerns.'
            ],
            keyFacts: ['10-20% output decline at some firms', 'Increased meeting time', 'Major firms mandate return']
          },
          {
            id: 'prod-3',
            title: 'Why Office Return Mandates Miss the Point',
            source: 'The New York Times',
            leaning: 'lean-left',
            summary: [
              'Blanket return-to-office mandates ignore substantial evidence that hybrid arrangements optimize both productivity and worker satisfaction.',
              'Companies with flexible policies report 25% higher retention rates than those requiring full-time office attendance.',
              'The productivity debate often masks other concerns, including real estate investments and traditional management preferences.',
              'Workers increasingly view flexibility as non-negotiable, with surveys showing 40% would take a pay cut to maintain remote options.'
            ],
            keyFacts: ['25% higher retention with flexibility', '40% would take pay cut for remote', 'Hybrid optimizes outcomes']
          }
        ]
      },
      {
        id: 'social-health',
        name: 'Social & Mental Health',
        description: 'Effects of remote work on social connections and wellbeing',
        articles: [
          {
            id: 'social-1',
            title: 'Remote Work Loneliness Reaches Crisis Levels',
            source: 'Psychology Today',
            leaning: 'center',
            summary: [
              'Surveys indicate that 67% of remote workers report feeling lonely at least sometimes, compared to 49% of in-office workers.',
              'The lack of casual social interactions—water cooler conversations, lunch with colleagues—has measurable impacts on mental health.',
              'Younger workers appear particularly affected, missing out on social connections that traditionally formed during early career years.',
              'Mental health professionals recommend intentional social strategies for remote workers, including regular in-person meetups and community involvement.'
            ],
            keyFacts: ['67% of remote workers feel lonely', 'Young workers most affected', 'Casual interactions matter']
          },
          {
            id: 'social-2',
            title: 'Work-Life Balance Improves for Remote Families',
            source: 'NPR',
            leaning: 'lean-left',
            summary: [
              'Parents report significant quality of life improvements from remote work, including more time with children and reduced childcare stress.',
              'The elimination of commuting has given workers an average of 72 minutes per day back for personal activities.',
              'Remote work has enabled people to care for aging parents while maintaining careers, a growing need as the population ages.',
              'Workers with disabilities have seen expanded employment opportunities as location barriers have fallen.'
            ],
            keyFacts: ['72 minutes saved daily', 'Better for caregivers', 'Improved disability access']
          }
        ]
      },
      {
        id: 'company-culture',
        name: 'Company Culture',
        description: 'How remote work affects organizational culture and collaboration',
        articles: [
          {
            id: 'culture-1',
            title: 'Silicon Valley Bets on In-Person Innovation',
            source: 'TechCrunch',
            leaning: 'lean-right',
            summary: [
              'Major tech companies argue that breakthrough innovation requires the serendipitous interactions that only in-person work provides.',
              'Apple, Google, and Meta have all implemented return-to-office policies, with leaders citing the importance of collaboration.',
              'Steve Jobs famously designed Pixar\'s headquarters to maximize chance encounters, a philosophy many executives still embrace.',
              'Research suggests that weak ties—casual acquaintances rather than close colleagues—are crucial for creative breakthroughs.'
            ],
            keyFacts: ['Big tech mandates return', 'Serendipitous innovation', 'Weak ties drive creativity']
          },
          {
            id: 'culture-2',
            title: 'Remote-First Companies Prove Culture Can Thrive Anywhere',
            source: 'Wired',
            leaning: 'lean-left',
            summary: [
              'Companies like GitLab, Zapier, and Automattic have built strong cultures entirely remotely, proving that physical presence is not required.',
              'Remote-first organizations often develop more intentional culture-building practices, including documented values and explicit communication norms.',
              'Employee engagement surveys at leading remote companies show scores comparable to or higher than traditional organizations.',
              'The key to remote culture success appears to be deliberate investment in connection, not proximity.'
            ],
            keyFacts: ['GitLab, Zapier succeed remotely', 'More intentional culture', 'Comparable engagement scores']
          }
        ]
      }
    ]
  },
  {
    id: 'space-funding',
    name: 'Space Exploration Funding',
    description: 'Should governments prioritize space exploration or domestic needs?',
    subTopics: [
      {
        id: 'innovation-benefits',
        name: 'Innovation Benefits',
        description: 'Technological and scientific returns from space investment',
        articles: [
          {
            id: 'innovation-1',
            title: 'Space Program Drives Innovation Economy',
            source: 'MIT Technology Review',
            leaning: 'center',
            summary: [
              'NASA estimates that every dollar invested in space exploration returns $7-14 to the economy through technological spinoffs and innovation.',
              'Technologies developed for space programs have transformed everyday life, including memory foam, water purification systems, and camera sensors.',
              'The space industry employs over 350,000 Americans in high-skilled, well-paying jobs that strengthen the technical workforce.',
              'International collaboration on space projects has historically reduced geopolitical tensions and built diplomatic bridges.'
            ],
            keyFacts: ['$7-14 return per dollar', '350,000+ US jobs', 'Multiple everyday spinoffs']
          },
          {
            id: 'innovation-2',
            title: 'Private Space Race Reduces Need for Government Spending',
            source: 'The Economist',
            leaning: 'lean-right',
            summary: [
              'SpaceX has reduced launch costs by 90% compared to government programs, fundamentally changing the economics of space access.',
              'Private companies are now capable of missions that previously required national space agencies, from satellite deployment to space tourism.',
              'Market competition has accelerated innovation faster than government programs alone could achieve.',
              'Some argue public funding should shift from direct operations to research grants and incentive prizes that leverage private capability.'
            ],
            keyFacts: ['90% cost reduction by SpaceX', 'Private capabilities expanding', 'Market drives innovation']
          }
        ]
      },
      {
        id: 'domestic-priorities',
        name: 'Domestic Priorities',
        description: 'Arguments for prioritizing earthly concerns',
        articles: [
          {
            id: 'domestic-1',
            title: 'With Crumbling Infrastructure, Space Dreams Are a Luxury',
            source: 'The Nation',
            leaning: 'left',
            summary: [
              'The $25 billion annual NASA budget could address critical domestic needs, from housing assistance to healthcare access.',
              'American Society of Civil Engineers estimates $2.6 trillion is needed for basic infrastructure repairs that directly affect citizens daily lives.',
              'Child poverty rates remain high while billions are spent on missions that primarily benefit a small scientific community.',
              'Critics argue that space funding represents misplaced priorities when so many Americans lack basic necessities.'
            ],
            keyFacts: ['$25B NASA budget', '$2.6T infrastructure needs', 'Competing with basic needs']
          },
          {
            id: 'domestic-2',
            title: 'Climate Crisis Demands Earth-Focused Investment',
            source: 'Grist',
            leaning: 'lean-left',
            summary: [
              'With climate change posing existential threats, some argue resources should focus on understanding and protecting our home planet.',
              'Earth observation satellites, while technically space technology, provide crucial climate monitoring data for pennies compared to exploration missions.',
              'The dream of escaping to Mars is criticized as a distraction from the urgent need to make Earth sustainable.',
              'Environmental groups suggest redirecting space funding to renewable energy research and climate adaptation.'
            ],
            keyFacts: ['Climate as existential priority', 'Earth observation is cost-effective', 'Sustainability over escape']
          },
          {
            id: 'domestic-3',
            title: 'Space Investment Is Domestic Investment',
            source: 'National Review',
            leaning: 'right',
            summary: [
              'Space program spending occurs entirely within the United States, supporting American jobs, companies, and communities.',
              'The Apollo program catalyzed STEM education and inspired a generation of engineers who drove decades of American innovation.',
              'National prestige and technological leadership have tangible economic benefits, attracting talent and investment to the US.',
              'Cutting space funding would cede leadership to China, which has announced ambitious lunar and Mars programs.'
            ],
            keyFacts: ['100% domestic spending', 'STEM inspiration', 'China competition']
          }
        ]
      },
      {
        id: 'commercial-future',
        name: 'Commercial Space Future',
        description: 'The role of private industry in space',
        articles: [
          {
            id: 'commercial-1',
            title: 'Space Mining Could Transform the Global Economy',
            source: 'Bloomberg',
            leaning: 'center',
            summary: [
              'Asteroids contain precious metals and rare earth elements worth potentially trillions of dollars.',
              'Space-based solar power could provide unlimited clean energy, beaming power to Earth without land use or weather constraints.',
              'Early investors in space resources could reap enormous returns, similar to early oil or tech investments.',
              'However, current technology makes space mining economically unviable, with returns likely decades away.'
            ],
            keyFacts: ['Trillions in asteroid resources', 'Space solar power potential', 'Returns decades away']
          },
          {
            id: 'commercial-2',
            title: 'Space Billionaires: Vision or Vanity?',
            source: 'The Guardian',
            leaning: 'lean-left',
            summary: [
              'Critics argue that space ventures by Musk, Bezos, and Branson represent billionaire vanity projects rather than public benefit.',
              'The resources devoted to private space programs could address homelessness, hunger, or disease if differently directed.',
              'Tax structures that enable massive personal wealth accumulation are questioned when contrasted with unmet social needs.',
              'Defenders counter that private space investment creates jobs and advances technology without using taxpayer funds.'
            ],
            keyFacts: ['Billionaire-funded ventures', 'Opportunity cost debate', 'Job creation benefits']
          }
        ]
      }
    ]
  }
];

export function getTopicById(id: string): Topic | undefined {
  return demoTopics.find(topic => topic.id === id);
}
