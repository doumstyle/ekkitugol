<?php

namespace App\Entity;

use App\Repository\WordsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WordsRepository::class)]
class Words
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $peul = null;

    #[ORM\Column(length: 255)]
    private ?string $french = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $audio = null;

    /**
     * @var Collection<int, UserWordProgress>
     */
    #[ORM\OneToMany(targetEntity: UserWordProgress::class, mappedBy: 'word')]
    private Collection $userWordProgress;

    public function __construct()
    {
        $this->userWordProgress = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPeul(): ?string
    {
        return $this->peul;
    }

    public function setPeul(string $peul): static
    {
        $this->peul = $peul;

        return $this;
    }

    public function getFrench(): ?string
    {
        return $this->french;
    }

    public function setFrench(string $french): static
    {
        $this->french = $french;

        return $this;
    }

    public function getAudio(): ?string
    {
        return $this->audio;
    }

    public function setAudio(?string $audio): static
    {
        $this->audio = $audio;

        return $this;
    }

    /**
     * @return Collection<int, UserWordProgress>
     */
    public function getUserWordProgress(): Collection
    {
        return $this->userWordProgress;
    }

    public function addUserWordProgress(UserWordProgress $userWordProgress): static
    {
        if (!$this->userWordProgress->contains($userWordProgress)) {
            $this->userWordProgress->add($userWordProgress);
            $userWordProgress->setWord($this);
        }

        return $this;
    }

    public function removeUserWordProgress(UserWordProgress $userWordProgress): static
    {
        if ($this->userWordProgress->removeElement($userWordProgress)) {
            // set the owning side to null (unless already changed)
            if ($userWordProgress->getWord() === $this) {
                $userWordProgress->setWord(null);
            }
        }

        return $this;
    }
}
