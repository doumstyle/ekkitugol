<?php

namespace App\Entity;

use App\Repository\UserWordProgressRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserWordProgressRepository::class)]
class UserWordProgress
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userWordProgress')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'userWordProgress')]
    private ?Words $word = null;

    #[ORM\Column(nullable: true)]
    private ?int $progress = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getWord(): ?Words
    {
        return $this->word;
    }

    public function setWord(?Words $word): static
    {
        $this->word = $word;

        return $this;
    }

    public function getProgress(): ?int
    {
        return $this->progress;
    }

    public function setProgress(?int $progress): static
    {
        $this->progress = max(0, min(100, $progress));

        return $this;
    }
}
